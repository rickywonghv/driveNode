/**
 * Created by damon on 6/24/16.
 */
var app=angular.module("fileApp",['authApp','ngMaterial','uploadApp','angular-loading-bar','ngAnimate']);
app.controller("fileCtrl",function($scope,FileService,$window,$http,AuthService,DirService,$interval,Dialog,cfpLoadingBar){
    var token=$window.sessionStorage.getItem("token");
    $scope.listDir=function(parent){
        cfpLoadingBar.start();
        DirService.listDir(parent,token,function(data){
            $scope.dirs=data.data.data;
            cfpLoadingBar.complete();
        })
    };

   $scope.listFile=function(dir,name){
       $scope.currentDir=dir;
       $scope.currentDirName=name;
       var token=$window.sessionStorage.getItem("token");
       $scope.token=token;
       FileService.list(dir,token,function(data){
           if(data.data.success){
               $scope.listDir(dir);
               $scope.files=data.data.data;
           }else{
               AuthService.destoy();
               $window.location.href="/login";
           }
       });
   };
    $scope.downloadFile=function(fileId){
        cfpLoadingBar.start();
        var token=$window.sessionStorage.getItem("token");
        FileService.download(fileId,token);
        cfpLoadingBar.complete();
    };
    
    $scope.delFile=function(fileId,fileName,parent){
        var token=$window.sessionStorage.getItem("token");
        FileService.delete(fileId,fileName,token);
        $interval(function(){$scope.listFile(parent)},3600*2,1);
    };

    $scope.newDir=function(currDir){
        Dialog.showPrerenderedDialog("#newDir");
    };

    $scope.createDir=function(currDir){
        var token=$window.sessionStorage.getItem("token");
        DirService.createDir(currDir,$scope.dirname,token,function(){

        });
    }
});

app.factory('DirService',function($http,Dialog,$window,$httpParamSerializer){
   var dir={};
    dir.listDir=function(parent,token,next){
        $http.get("/api/dir?token="+token+"&parent="+parent).then(function(data){
            next(data);
        },function(err){
            next(err);
        });
    };
    dir.createDir=function(parent,name,token,next){
        var data=$httpParamSerializer({dir:parent,dirname:name,token:token});
        $http.post("/api/dir",data,{headers:{'Content-Type':'application/x-www-form-urlencoded'}}).then(function(data){
           next(data);
        },function(err){
            next(err);
        });
    };
   return dir;
});

app.factory('FileService',function($http,Dialog,$window,Toast,$interval,cfpLoadingBar){
   var file={};

    file.list=function(dir,apptoken,next){
        $http.get("/api/file?token="+apptoken+"&&dir="+dir).then(function(data){
            next(data);
        });
    };

    file.download=function(fileId,apptoken){
        var downloadLink = angular.element('<a></a>');
        downloadLink.attr('href',"/api/download?fileId="+fileId+"&token="+apptoken);
        downloadLink[0].click();

        /*
        $http.get("/api/download?token="+apptoken+"&&fileId="+fileId).then(function(data){
            console.log(data);
            //var downloadLink = angular.element('<a></a>');
            //downloadLink.attr('href',"/api/download?fileId="+fileId+"&token="+apptoken);
            //downloadLink[0].click();
            data.click();
            cfpLoadingBar.complete();
        },function(data){
            if(data){
                Dialog.showAlert('Error',data.data.error);
            }
        });
        */
    };

    file.delete=function(fileId,fileName,apptoken){
        Dialog.showConfirm("Confirm to Delete","A you sure to delete "+fileName+"? ",function(data){
            if(data){
                $http.delete("/api/file/"+fileId+"?token="+apptoken).then(function(result){
                    Toast.showSimple(fileName+" is deleted");
                },function(err){
                    Dialog.showAlert('Error',err.data.error);
                });
            }
        })
    };

    return file;
});

app.factory('Dialog',function($mdDialog, $mdMedia){
    var dialog={};

    dialog.showAlert=function(title,cont) {
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
    dialog.showConfirm = function(title,cont,next) {
        var confirm = $mdDialog.confirm()
            .title(title)
            .textContent(cont)
            .ariaLabel('Del Dialog')
            .targetEvent()
            .ok('Please do it!')
            .cancel('Cancel');
        $mdDialog.show(confirm).then(function() {
            //$scope.status = 'You decided to get rid of your debt.';
            next(true);
        }, function() {
            //$scope.status = 'You decided to keep your debt.';
            next(false);
        });
    };

    dialog.showPrerenderedDialog = function(id) {
        $mdDialog.show({
            controller: DialogController,
            contentElement:id,
            parent: angular.element(document.body),
            targetEvent: '',
            clickOutsideToClose: true
        });
    };

    function DialogController($mdDialog) {
        dialog.hide = function() {
            $mdDialog.hide();
        };
        dialog.cancel = function() {
            $mdDialog.cancel();
        };
        dialog.answer = function(answer) {
            $mdDialog.hide(answer);
        };
    }

    return dialog;
});

app.factory('Toast',function($mdToast){
    var toast={};
    var last = {
        bottom: false,
        top: true,
        left: false,
        right: true
    };
    toast.toastPosition = angular.extend({},last);
    toast.getToastPosition = function() {
        sanitizePosition();
        return Object.keys(toast.toastPosition)
            .filter(function(pos) { return toast.toastPosition[pos]; })
            .join(' ');
    };
    function sanitizePosition() {
        var current = toast.toastPosition;
        if ( current.bottom && last.top ) current.top = false;
        if ( current.top && last.bottom ) current.bottom = false;
        if ( current.right && last.left ) current.left = false;
        if ( current.left && last.right ) current.right = false;
        last = angular.extend({},current);
    }
    toast.showSimple = function(cont) {
        var pinTo = toast.getToastPosition();
        $mdToast.show(
            $mdToast.simple()
                .textContent(cont)
                .position(pinTo )
                .hideDelay(3000)
        );
    };
    return toast;
})

