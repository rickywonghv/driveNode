/**
 * Created by damon on 6/25/16.
 */
var app=angular.module('adminApp', ['ngMaterial','ngCookies','authApp','fileApp']);
app.controller('adminCtrl',function($scope,$window,AdminManage,Dialog,$interval){
    $scope.usersList=function(){
        AdminManage.listUsers(function(data){
            $scope.admins=data;
        });
    };

    $scope.userMore=function(userId){
        
    };

    $scope.newUserDia=function(){
        Dialog.showPrerenderedDialog("#newUser");
    };
    
    $scope.createUser=function(){
        var token=$window.sessionStorage.getItem("token");
        var query={username:$scope.user.username,password:$scope.user.password,conpassword:$scope.user.conpassword,email:$scope.user.email,name:$scope.username,space:$scope.user.space,admin:$scope.user.admin,token:token};
        AdminManage.createUser(query,function(data){
            if(data.data.success){
                $scope.result="User Added";
                $interval(function(){$scope.usersList()},36,1);
            }else{
                $scope.result=data.data.error;
            }
        })
    };

    $scope.spaces = ('Unlimit 100gb 50gb 30gb 10gb 5gb 2gb 1gb 500MB')
        .split(' ').map(function(space) {
        return {abbrev: space};
    });

});
app.factory('AdminManage',function($http,$window,$httpParamSerializer){
    var admin={};
    var token=$window.sessionStorage.getItem("token");
    admin.listUsers=function(next){
        $http.get("/admin/api/admin?token="+token).then(function(data){
            next(data.data.data);
        },function(err){
            next(err.data);
        })
    };
    
    admin.createUser=function(query,next){
        var data=$httpParamSerializer(query);
        $http.post("/api/user",data,{headers:{'Content-Type':'application/x-www-form-urlencoded'}}).then(function(data){
            next(data);
        },function(err){
            next(err);
        });
    };
    
    return admin; 
});