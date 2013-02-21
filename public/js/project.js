var app=angular.module("App",["Storage"]);


app.config(function ($routeProvider){
    $routeProvider.
        when('/agentes',{templateUrl:'partials/blank.html',controller:AgentesCtrl}).
        when('/gestorias',{templateUrl:'partials/blank.html',controller:GestoriasCtrl}).
        when('/clientes',{templateUrl:'partials/clientes.html',controller:ClienteDashCtrl}).
        when('/clientes/:clienteID',{templateUrl:'partials/clientes.html',controller:ClienteCtrl}).
        otherwise({redirectTo: '/clientes'});

});
function AgentesCtrl($scope){$scope.changeNav(1);}
function GestoriasCtrl($scope){$scope.changeNav(2);}

function MainCtrl($scope,$http){
    var original=[];
    $scope.dateFormat={
        'language':'es',
        'format':'dd-mm-yy',
        'autoclose':true,
        'weekStart':1,
        'todayHighlight':true
    };
    $scope.nav=0;
    $scope.changeNav=function (i){$scope.nav=i;}

    $scope.sinCambios=function (){
        return angular.equals(original,$scope.clientes);
    }

    $scope.clientes=[];

    //get clientes
    $http.get('https://api.mongolab.com/api/1/databases/miriam/collections/clientes?apiKey=51069a2be4b01e6f7259b79e').
        success(function (data){
            $scope.clientes=data;
            original=angular.copy(data);
            $scope.$broadcast("datos");
        }).
        error(function (e){
            console.log(e);
        });

//    actualiza los datos en el servidor
    $scope.actualizaServer=function (){
        var clis=angular.copy($scope.clientes);
//        borrar propiedad $$hashKey de todos los objectos tanto de []cliente como []productos
        angular.forEach(clis,function (v,k){
            v.$$hashKey=undefined;
            if(v.productos.length > 0 ){angular.forEach(v.productos,function (w,l){w.$$hashKey=undefined;});}
        });

        $http.put('https://api.mongolab.com/api/1/databases/miriam/collections/clientes?apiKey=51069a2be4b01e6f7259b79e',JSON.stringify(clis)).
            success(function (){
                original=clis;
            }).
            error(function (e){
                console.log(e);
                alert("error al comunicar con el servidor. Intentánlo de nuevo");
            });
    }

}


function ClienteCtrl($scope,$routeParams,$location){
    $scope.changeNav(0);
    $scope.listaProductos = [
        {nombre:'producto1',tipo:'Ahorro'},
        {nombre:'producto2',tipo:'Ahorro'},
        {nombre:'producto3',tipo:'Ahorro'},
        {nombre:'producto4',tipo:'Pensiones'},
        {nombre:'producto5',tipo:'Pensiones'},
        {nombre:'producto6',tipo:'Pensiones'}
    ];

    $scope.prodNuevo={productoElegido:"",comp:"",fecha:"",vencimiento:"",importe:""};


    $scope.addProducto=function (producto){
        $scope.prodNuevo={productoElegido:"",comp:"",fecha:"",vencimiento:"",importe:""};
        $scope.cliente.productos.push(producto);
    }

    $scope.removeProducto=function (producto,cliente){
        if(cliente.productos && cliente.productos.length > 0){
            angular.forEach(cliente.productos,function (v,k){
                if(angular.equals(producto,v)){
                    cliente.productos.splice(k,1);
                }
            });
        }
    }



    $scope.crearCliente=function (cliente){
        var nexposition=$scope.clientes.push(cliente);
        $location.path("/clientes/"+(nexposition-1));
    }

//    Navegación de diferentes secciones
    if($routeParams.clienteID){
        $scope.templateUrl='partials/clienteForm.html';
        if($routeParams.clienteID=='nuevo'){
            $scope.cliente={productos:[]};
            $scope.nuevo=1;
        }else{
            $scope.cliente=$scope.clientes[$routeParams.clienteID];
//            Por si hay un cliente seleccionado en la Url, hay que esperar a que carguen los clientes
            $scope.$on("datos",function (){
                $scope.cliente=$scope.clientes[$routeParams.clienteID];
            });
        }
    }

}


function ClienteDashCtrl($scope){
    $scope.changeNav(0);
    $scope.templateUrl='partials/clienteDash.html';

    $scope.numClientes=function (){
        return $scope.clientes.length;
    }
    $scope.numProductos=function (){
        var num=0;
        angular.forEach($scope.clientes,function(v,k){
            num+= v.productos.length;
        });
        return num;
    }


}