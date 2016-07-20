var app = angular.module('irs-metrics-app', ['720kb.datepicker','angularjs-dropdown-multiselect','ngTouch','ui.grid','ui.grid.grouping','ui.grid.selection']);


app.controller("eventSum", function($scope, $rootScope, $interval, $http) {
    function dynamicSort(property) {
        var sortOrder = 1;
        if(property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        };
        return function (a,b) {
            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        };
    };
    
    $scope.main = this;
    $scope.cellWidth = 1000/3;
    $scope.gridOptions = {
        treeRowHeaderAlwaysVisible: false,
        headerTemplate: 'header-template.html',
        category: [{name: 'Report Data', visible: true}],
        enableGridMenu: false,
        enableSorting: false,
        multiSelect: true,
        columnDefs: [
          {name: 'eventCategory', category:'Report Data', grouping: { groupPriority: 0 }, width: $scope.cellWidth, enableColumnMenu: false},
          {name:'eventType', category:'Report Data', width: $scope.cellWidth, enableColumnMenu: false},
          {name:'eventCount', category:'Report Data', width: $scope.cellWidth, enableColumnMenu: false}
          ],
        data: [],
        onRegisterApi: function( gridApi ) {
          main.gridApi = gridApi;
        }
    };
    
    $scope.utcStamp = new Date().toJSON();
    
    $scope.reportType = '';
    $scope.reportStyle = '';
    $scope.reportFreq = '';
    
    $scope.$watch('reportType.id', function(newValue, oldValue) { 
        if (newValue == 1) {
            var x = newValue.toString();
            $scope.reportTypeAPIparam = "events";
        };
        if (newValue == 2) {
            var x = newValue.toString();
            $scope.reportTypeAPIparam = "scalars";
        };
        if (newValue == 3) {
            var x = newValue.toString();
            $scope.reportTypeAPIparam = "enums";
        };
    }); 
    
    
    $scope.$watchGroup(['reportStyle.id','dateFrom','dateTill'], function(newValues, oldValues) { 
        if (newValues[0] == 1) {
            var d1 = newValues[1].getDate();
            var m1 = newValues[1].getMonth() + 1;
            var y1 = newValues[1].getFullYear();
            var date1 = '' + y1 + '-' + (m1<=9 ? '0' + m1 : m1) + '-' + (d1 <= 9 ? '0' + d1 : d1);
            $scope.reportDateAPI = "periodDate=" + date1;
        };
        if (newValues[0] == 2) {
            var d1 = newValues[1].getDate();
            var m1 = newValues[1].getMonth() + 1;
            var y1 = newValues[1].getFullYear();
            var date1 = '' + y1 + '-' + (m1<=9 ? '0' + m1 : m1) + '-' + (d1 <= 9 ? '0' + d1 : d1);
            var d2 = newValues[2].getDate();
            var m2 = newValues[2].getMonth() + 1;
            var y2 = newValues[2].getFullYear();
            var date2 = '' + y2 + '-' + (m2<=9 ? '0' + m2 : m2) + '-' + (d2 <= 9 ? '0' + d2 : d2);
            $scope.reportDateAPI = "fromDate=" + date1 + "&toDate=" + date2;
        };
    }); 
    
    $scope.$watch('reportStyle.id', function(newValue, oldValue) { 
        if (newValue == 1) {
            var x = newValue.toString();
            $scope.reportStyleAPIparam = "summary";
        };
        if (newValue == 2) {
            var x = newValue.toString();
            $scope.reportStyleAPIparam = "adhoc";
        };
    }); 
    
    
    $scope.$watch('reportFreq.id', function(newValue, oldValue) { 
        if (newValue == 1) {
            var x = newValue.toString();
            $scope.reportFreqAPIparam = "?periodType=daily";
        };
        if (newValue == 2) {
            var x = newValue.toString();
            $scope.reportFreqAPIparam = "?periodType=monthly";
        };
        if (newValue == 3) {
            var x = newValue.toString();
            $scope.reportFreqAPIparam = "?periodType=yearly";
        };
    }); 
    
    /*
    Configure the API using Form input here. Change URL in production.
    http://ec2-52-5-122-115.compute-1.amazonaws.com:8080
    */

    $scope.$watchGroup(['reportTypeAPIparam','reportFreqAPIparam', 'reportStyleAPIparam','reportDateAPI'], function(newValues, oldValues) {
        if (newValues[2] == "summary") {
            $scope.apiEndpoint = "http://ec2-52-29-238-173.eu-central-1.compute.amazonaws.com:8080/v1.0/" + newValues[2] + "/" + newValues[0] + "/period" + newValues[1] + "&" + newValues[3]; 
        };
        if (newValues[2] == "adhoc") {
            $scope.apiEndpoint = "http://ec2-52-29-238-173.eu-central-1.compute.amazonaws.com:8080/v1.0/" + newValues[2] + "/" + newValues[0] + newValues[1] + "&" + newValues[3]; 
        };
        $scope.apiParams = newValues; 
    });
    
    $scope.testIn = 
        [{"eventPeriod":"2016-06-21","eventCategory":"BalDue","eventType":"s_YearlyBalanceDue","eventCount":"3"},
         {"eventPeriod":"2016-06-21","eventCategory":"BalDue","eventType":"s_baldue","eventCount":"18"},
         {"eventPeriod":"2016-06-21","eventCategory":"MakeAPayment","eventType":"s_PaymentOwed","eventCount":"24"},
         {"eventPeriod":"2016-06-21","eventCategory":"OLA","eventType":"IPAddress","eventCount":"7"},
         {"eventPeriod":"2016-06-21","eventCategory":"OLA","eventType":"RealIPAddress","eventCount":"3"},
         {"eventPeriod":"2016-06-21","eventCategory":"OLA","eventType":"SessionEnd","eventCount":"7"},
         {"eventPeriod":"2016-06-21","eventCategory":"OLA","eventType":"SessionStart","eventCount":"7"},
         {"eventPeriod":"2016-06-21","eventCategory":"OLA","eventType":"URL","eventCount":"4"},
         {"eventPeriod":"2016-06-21","eventCategory":"OLA","eventType":"s_SessionDuration","eventCount":"11"}];
    
    
    $scope.dateFrom = new Date();
    $scope.dateTill = new Date();
    
    $scope.categorySettings = {
        displayProp: 'label',
        scrollableHeight: '200px',
        scrollable: true
    };
    $scope.categoryModel = []; 
    $scope.categoryData = [ 
        {id: 1, label: "BalDue"}, 
        {id: 2, label: "MakeAPayment"}, 
        {id: 3, label: "OLASession"}
    ];
    
    $scope.reports = [
        { id: 1, name: 'Event Report'},
        { id: 2, name: 'Scalar Report'},
        { id: 3, name: 'Enumeration Report'}];
    
    $scope.reportStyles = [
        { id: 1, name: 'Summary'},
        { id: 2, name: 'Ad Hoc'}];
    
    $scope.reportFreqs = [
        { id: 1, name: 'Daily'},
        { id: 2, name: 'Monthly'},
        { id: 3, name: 'Yearly'}];
    
    
    $scope.username='';
    $scope.password='';
    $scope.reportDate='';
    
    
    $scope.getAPI = function(){
        $http.get($scope.apiEndpoint, { headers: { 
            'Accept':'*/*',
            'Access-Control-Allow-Origin':'*/*',
            'Access-Control-Allow-Origin': '*', 
            'Accept-Language':'en-US,en;q=0.8',
            'Access-Control-Request-Headers':'accept, accept-language, access-control-allow-methods, access-control-allow-origin',
            'Access-Control-Request-Method':'GET',
            'Accept': 'application/json', 
            'Content-Type': 'text/plain', 
            'Access-Control-Allow-Methods' : 'POST, GET, PUT' } }).then(function(response){ $scope.detailsEvent = response.data; });
    };

    $scope.resetForm = function (){
	$scope.testIn = [];
        $scope.detailsEvent = [];
        $scope.main = this;
        $scope.cellWidth = 1000/3;
        $scope.gridOptions = {
            treeRowHeaderAlwaysVisible: false,
            headerTemplate: 'header-template.html',
            category: [{name: 'Report Data', visible: true}],
            enableGridMenu: false,
            enableSorting: false,
            multiSelect: true,
            columnDefs: [
              {name: 'eventCategory', category:'Report Data', grouping: { groupPriority: 0 }, width: $scope.cellWidth, enableColumnMenu: false},
              {name:'eventType', category:'Report Data', width: $scope.cellWidth, enableColumnMenu: false},
              {name:'eventCount', category:'Report Data', width: $scope.cellWidth, enableColumnMenu: false}
              ],
            data: [],
            onRegisterApi: function( gridApi ) {
              main.gridApi = gridApi;
            }
        };    
    };
    
    $scope.loadNewFilter = function (){
        $scope.$watch('reportTypeAPIparam', function(newValue, oldValue) { 
            if (newValue == "events") {
                $scope.testIn = $scope.detailsEvent;
                $scope.main = this;
                $scope.cellWidth = 1000/3;
                $scope.gridOptions = {
                    treeRowHeaderAlwaysVisible: false,
                    headerTemplate: 'header-template.html',
                    category: [{name: 'Report Data', visible: true}],
                    enableGridMenu: false,
                    enableSorting: false,
                    multiSelect: true,
                    columnDefs: [
                      {name: 'eventCategory', category:'Report Data', grouping: { groupPriority: 0 }, width: $scope.cellWidth, enableColumnMenu: false},
                      {name:'eventType', category:'Report Data', width: $scope.cellWidth, enableColumnMenu: false},
                      {name:'eventCount', category:'Report Data', width: $scope.cellWidth, enableColumnMenu: false}
                      ],
                    data: $scope.testIn.sort(dynamicSort("eventCategory")),
                    onRegisterApi: function( gridApi ) {
                      main.gridApi = gridApi;
                    }
                };
                $scope.reportDate = $scope.testIn[0].eventPeriod;
                $scope.$apply();
                $scope.$apply();
            };
            if (newValue == "scalars") {
                $scope.testIn = $scope.detailsEvent;
                $scope.main = this;
                $scope.cellWidth = 1000/7;
                $scope.gridOptions = {
                    treeRowHeaderAlwaysVisible: false,
                    headerTemplate: 'header-template.html',
                    category: [{name: 'Report Data', visible: true}],
                    enableGridMenu: false,
                    enableSorting: false,
                    multiSelect: true,
                    columnDefs: [
                      {name: 'eventCategory', category:'Report Data', grouping: { groupPriority: 0 }, width: $scope.cellWidth, enableColumnMenu: false},
                      {name:'eventType', category:'Report Data', width: $scope.cellWidth, enableColumnMenu: false},
                      {name:'eventCount', category:'Report Data', width: $scope.cellWidth, enableColumnMenu: false},
                      {name:'eventMinValue', category:'Report Data', width: $scope.cellWidth, enableColumnMenu: false},
                      {name:'eventMaxValue', category:'Report Data', width: $scope.cellWidth, enableColumnMenu: false},
                      {name:'eventMeanValue', category:'Report Data', width: $scope.cellWidth, enableColumnMenu: false},
                      {name:'eventSumValue', category:'Report Data', width: $scope.cellWidth, enableColumnMenu: false}
                      ],
                    data: $scope.testIn.sort(dynamicSort("eventCategory")),
                    onRegisterApi: function( gridApi ) {
                      main.gridApi = gridApi;
                    }
                };
                $scope.reportDate = $scope.testIn[0].eventPeriod;
                $scope.$apply();
                $scope.$apply();
            };
            if (newValue == "enums") {
                $scope.testIn = $scope.detailsEvent;
                $scope.main = this;
                $scope.cellWidth = 1000/7;
                $scope.gridOptions = {
                    treeRowHeaderAlwaysVisible: false,
                    headerTemplate: 'header-template.html',
                    category: [{name: 'Report Data', visible: true}],
                    enableGridMenu: false,
                    enableSorting: false,
                    multiSelect: true,
                    columnDefs: [
                      {name: 'eventCategory', category:'Report Data', grouping: { groupPriority: 0 }, width: $scope.cellWidth, enableColumnMenu: false},
                      {name:'eventType', category:'Report Data', width: $scope.cellWidth, enableColumnMenu: false},
                      {name:'Enum 1', category:'Report Data', width: $scope.cellWidth, enableColumnMenu: false},
                      {name:'Enum 2', category:'Report Data', width: $scope.cellWidth, enableColumnMenu: false},
                      {name:'Enum 3', category:'Report Data', width: $scope.cellWidth, enableColumnMenu: false},
                      {name:'Enum 4', category:'Report Data', width: $scope.cellWidth, enableColumnMenu: false},
                      {name:'Enum 5', category:'Report Data', width: $scope.cellWidth, enableColumnMenu: false}
                      ],
                    data: $scope.testIn.sort(dynamicSort("eventCategory")),
                    onRegisterApi: function( gridApi ) {
                      main.gridApi = gridApi;
                    }
                };
                $scope.reportDate = $scope.testIn[0].eventPeriod;
                $scope.$apply();
                $scope.$apply();
            };
            
        }); 
    };
    
});
