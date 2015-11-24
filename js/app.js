var app = angular.module("serve", ["colorpicker.module"])

.controller("MainCtrl", ["$scope", "$sce", function($scope, $sce) {
    // var url = "http://10.171.38.27:3030/stand-alone-app/src/";
	var url = "http://www.rentalcars.com/partners/integrations/stand-alone-app/";
    $scope.template = "standard";
	$scope.parameters = {
        "template": "standard",
        "returnCheckboxEnabled": "true"
    };
	$scope.iframe = $sce.trustAsResourceUrl(url + "?returnCheckboxEnabled=true");
	$scope.$watch('parameters', function(newParameters, oldParameters){
		if (!angular.equals(newParameters, oldParameters)) {
			var query = "?";
			for (var parameter in newParameters) {
                if (parameter === "template" && newParameters[parameter] !== "universal") continue;
				var val = "" + newParameters[parameter];
				if (val.indexOf("#") === 0) val = val.substr(1);
				query += parameter.replace( /([A-Z])/g, "-$1" ).toLowerCase() + "=" + val + "&"
			}
			$scope.iframe = $sce.trustAsResourceUrl(url + query.slice(0, -1));
		}
	}, true);


    $scope.arrow = "▲";
    $scope.windowOpen = false;

    $scope.toggleWindow = function() {
        $scope.windowOpen = !$scope.windowOpen;
    }
}])

.directive('slideable', function () {
    return {
        restrict:'C',
        compile: function (element, attr) {
            // wrap tag
            var contents = element.html();
            element.html('<div class="slideable-content" style="margin:0 !important; padding:0 !important" >' + contents + '</div>');

            return function postLink(scope, element, attrs) {
                // default properties
                attrs.duration = (!attrs.duration) ? '.5s' : attrs.duration;
                attrs.easing = (!attrs.easing) ? 'ease-in-out' : attrs.easing;
                element.css({
                    'overflow': 'hidden',
                    'height': '0px',
                    'transitionProperty': 'height',
                    'transitionDuration': attrs.duration,
                    'transitionTimingFunction': attrs.easing
                });
            };
        }
    };
})

.directive('slideToggle', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var target, content;

            attrs.expanded = false;

            element.bind('click', function() {
                if (!target) target = document.querySelector(attrs.slideToggle);
                if (!content) content = target.querySelector('.slideable-content');

                if(!attrs.expanded) {
                    content.style.border = '1px solid rgba(0,0,0,0)';
                    var y = content.clientHeight;
                    content.style.border = 0;
                    target.style.height = y + 'px';
                } else {
                    target.style.height = '0px';
                }
                attrs.expanded = !attrs.expanded;
            });
        }
    }
});