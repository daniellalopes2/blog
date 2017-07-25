(function() {
    angular
        .module("BlogApp", [])
        .controller("BlogController", BlogController).controller("HomeController", HomeController);

    function BlogController($scope, $http){
        $scope.createPost = createPost;
        $scope.deletePost = deletePost;
        $scope.editPost = editPost;
        $scope.updatePost = updatePost;
        

        function init() {
                getAllPosts();
        }

        init();

        function updatePost(post){
            $http
            .put("/api/blogpost/" + post._id, post).then(function (post){
            getAllPosts();
        });
        }

        function editPost(postId){
            $http
                .get("/api/blogpost/"+postId).then(function (post){
                $scope.post = post.data;
            });

        }

        function deletePost(postId) {
            $http.delete("/api/blogpost/"+postId).then(function (){ // .then callback do delete . Retorno da chamada.
                getAllPosts();
            });
        }
        
        function getAllPosts() {
            $http
            .get("/api/blogpost").then(function (posts){
                    $scope.posts = posts.data;
                },function (error){

                });
        }

        function createPost(post) {
            console.log(post);
            $http
                .post("/api/blogpost", post).then(function (){
                getAllPosts();
            });

        }
    }
function HomeController($scope, $http){
    $scope.createLead = createLead;
        function createLead(lead) {
            $http.get("https://ipinfo.io/").then(function (response) {
                lead.ip = response.data.ip;
                $http.post("/api/bloglead", lead);
            });          
        }
}


})();