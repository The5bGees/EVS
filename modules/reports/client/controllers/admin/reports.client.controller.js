(function () {
  'use strict';

  angular
    .module('reports.admin')
    .controller('ReportsAdminController', ReportsAdminController);

  ReportsAdminController.$inject = ['$scope', '$state', '$window', 'reportResolve', 'OilsService', 'CompaniesService', 'Authentication', 'Upload', 'Notification'];

  function ReportsAdminController($scope, $state, $window, report, OilsService, CompaniesService, Authentication, Upload, Notification) {
    var vm = this;

    vm.report = report;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.user = Authentication.user;
    vm.oils = OilsService.query();
    vm.companies = CompaniesService.query();

    // Remove existing Report
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.report.$remove(function () {
          $state.go('admin.reports.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Report deleted successfully!' });
        });
      }
    }

    // Save Report
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.reportForm');
        return false;
      }

      vm.report.date = new Date(vm.report.date); 

      if (vm.report.result === 'Pass') {
        vm.report.resultColor = '#08ce12';
      } else if (vm.report.result === 'Fail') {
        vm.report.resultColor = '#ce0707';
      }

      if (vm.report.simplePdf) {
        Upload.upload({
          url: '/api/reports/pdf',
          data: {
            pdf: vm.report.simplePdf
          }
        }).then(function (res) {
          var pdfPath = res.data.url;
          if (pdfPath) {
            vm.report.simplePdfPath = pdfPath;
            vm.report.simplePdfName = vm.report.simplePdf.name;
          } else {
            vm.report.simplePdfPath = null;
            vm.report.simplePdfName = null;
          }
          vm.report.createOrUpdate()
            .then(successCallback)
            .catch(errorCallback);
        }).catch(function (err) {
          Notification.error({
            message: err.toString(),
            title: '<i class="glyphicon glyphicon-remove"></i> PDF upload error!'
          });
        });
      } else {
        vm.report.createOrUpdate()
          .then(successCallback)
          .catch(errorCallback);
      }

      function successCallback(res) {
        $state.go('admin.reports.list');
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Report saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({
          message: res.data.message,
          title: '<i class="glyphicon glyphicon-remove"></i> Report save error!'
        });
      }
    }
  }
}());
