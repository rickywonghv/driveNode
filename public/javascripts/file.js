/**
 * Created by damon on 6/24/16.
 */
var app=angular.module("fileApp",['authApp','ngMaterial']);
app.controller("fileCtrl",function($scope,FileService,$window,$http,AuthService){
   $scope.listFile=function(dir){
       var token=$window.sessionStorage.getItem("token");
       FileService.list(dir,token,function(data){
           if(data.data.success){
               $scope.files=data.data.data;
           }else{
               AuthService.destoy();
               $window.location.href="/login";
           }
       });
   };
    $scope.downloadFile=function(fileId){
        var token=$window.sessionStorage.getItem("token");
        FileService.download(fileId,token);
    };
});

app.factory('FileService',function($http,$mdDialog, $mdMedia){
   var file={};
    file.list=function(dir,apptoken,next){
        $http.get("/api/list?token="+apptoken+"&&dir="+dir).then(function(data){
            next(data);
        });
    };
    file.download=function(fileId,apptoken){
        $http.get("/api/download?token="+apptoken+"&&fileId="+fileId).then(function(data){
            var downloadLink = angular.element('<a></a>');
            downloadLink.attr('href',"/api/download?fileId="+fileId+"&token="+apptoken);
            downloadLink[0].click();
        },function(data){
            if(data){
                showAlert('Error',data.data.error);
            }
        });
    };
    return file;

    function showAlert(title,cont) {
        $mdDialog.show(
            $mdDialog.alert()
                .parent(angular.element(document.querySelector('#popupContainer')))
                .clickOutsideToClose(true)
                .title(title)
                .textContent(cont)
                .ariaLabel('Alert')
                .ok('Got it!')
                .targetEvent()
        );
    };
});

