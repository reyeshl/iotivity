(function () {
    var wsicontroller = function ($scope, dbfactory) {

        $scope.selectService = function (service) {
            editor.set(service);
            document.getElementById("create").disabled = false;
            document.getElementById("save").disabled = true;
            preview.set({});
        };
        // create the editor
        var c = document.getElementById('jsoneditor');
        var p = document.getElementById('jsoneditorpreview');
        var options = {
            mode: "text",
            indentation: 2
        };
        var optionspreview = {
            mode: "tree",
            indentation: 2
        };

        var editor  = new JSONEditor(c, options);
        var preview = new JSONEditor(p, optionspreview);
        preview.expandAll();
        $scope.selService = null;
        $scope.strategy = [];

        dbfactory.get()
                .success(function (data) {
                    $scope.services = data;
                    $scope.exampleServices = data;
                });

        $scope.getExampleServices = function(){
            return $scope.exampleServices;
        }

        //CRUDN for Services.
        $scope.createService = function () {
            if (editor.get() != undefined) {
                dbfactory.create(JSON.stringify(editor.get()))
                        .success(function (data) {
                            $scope.services = data;
                            preview.set(data);
                            preview.expandAll();
                        });
            }
        };
        $scope.readService = function (serviceid) {
            console.log("Read Service : " + serviceid);
            document.getElementById("create").disabled = true;
            document.getElementById("save").disabled = false;
            dbfactory.read(serviceid)
                    .success(function (data) {
                        editor.set(data);
                        preview.set(data);
                        preview.expandAll();
                        $scope.selService = serviceid;
                    });
        };

        $scope.updateService = function () {
            if (preview.get() != null) {
                dbfactory.update($scope.selService, editor.get())
                        .success(function (data) {
                            $scope.services = data;
                            //FIXME : View Not Updating
                            //editor.set(data);
                            preview.set(data);
                            preview.expandAll();
                        });
            }
        };
        $scope.deleteService = function (id) {
            dbfactory.delete(id)
                    .success(function (data) {
                        $scope.services = data; // assign our new list of services
                        editor.set({});
                        preview.set({});
                    });
        };
    };

    wsicontroller.$inject = ['$scope', 'dbfactory'];

    angular.module('wsi').controller('wsicontroller', wsicontroller);
}());