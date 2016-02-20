
//
// Define the 'app' module.
//
angular.module('app', ['flowChart', ])

//
// Application controller.
//
.controller('AppCtrl', ['$scope',
						'$document',
						'BitService',
						'IOService',
						'LogicService',
						'CombService',
						'SecService',
						'LabelService',
						function AppCtrl ($scope,
										  $document,
										  BitService,
									  	  IOService,
									      LogicService,
									      CombService,
									      SecService,
									      LabelService) {

	var fs = require('fs');
	var child_process = require('child_process');

	// Code for the delete key.
	var deleteKeyCode = 46;
	// Code for control key.
	var ctrlKeyCode = 17;
	// Set to true when the ctrl key is down.
	var ctrlDown = false;
	// Code for esc key.
	var escKeyCode = 27;
	// Selects the next node id.
	var nextNodeID = 10;

	$scope.showEditor = false;
    $scope.showPinout = false;

	$scope.filepath = 'gen/main.json'

	$scope.reset = function () {
		nextNodeID = 10;
		data = { nodes: [], connections: [] }
		$scope.chartDataModel = data;
		$scope.chartViewModel = new flowchart.ChartViewModel(data);
	};

	$scope.reset()

	$scope.load = function () {
		var data = JSON.parse(fs.readFileSync($scope.filepath));
		var max = nextNodeID;
		for (var i = 0; i < data.nodes.length; i++) {
			if (data.nodes[i].id > max) {
				max = data.nodes[i].id;
			}
		}
		nextNodeID = max + 1;
		$scope.chartDataModel = data;
		$scope.chartViewModel = new flowchart.ChartViewModel(data);
	};

	$scope.save = function () {
		fs.writeFile($scope.filepath, JSON.stringify($scope.chartDataModel, null, 2),  function(err) {
			if (!err) {
				return console.error(err);
			}
		});
	};

	$scope.build = function () {
		$scope.chartViewModel.deselectAll();
		fs.writeFile($scope.filepath, JSON.stringify($scope.chartDataModel, null, 2),  function(err) {
			if (!err) {
				const result = child_process.spawnSync('apio', ['build']);
				if (result.stdout.length !== 0) {
					if (result.stdout.toString().indexOf('error') != -1) {
						alertify.error("Build fail");
					}
					else {
						alertify.success("Build success");
					}
				}
				else {
					alertify.error("Build fail");
				}
			}
		});
	};

	$scope.upload = function () {
		$scope.chartViewModel.deselectAll();
		const result = child_process.spawnSync('apio', ['upload']);
		if (result.stdout.length !== 0) {
			if (result.stdout.toString().indexOf("error") != -1) {
				alertify.error("Upload fail");
			}
			else {
				alertify.success("Upload success");
			}
		}
		else {
			alertify.error("Upload fail");
		}
	};

	// Event handler for key-down on the flowchart.
	$scope.keyDown = function (evt) {

		if (evt.keyCode === ctrlKeyCode) {

			ctrlDown = true;
			evt.stopPropagation();
			evt.preventDefault();
		}
	};

	// Event handler for key-up on the flowchart.
	$scope.keyUp = function (evt) {

		if (evt.keyCode === deleteKeyCode) {
			// Delete key.
			$scope.chartViewModel.deleteSelected();
		}

		if (evt.keyCode == escKeyCode) {
			// Escape.
			$scope.chartViewModel.deselectAll();
		}

		if (evt.keyCode === ctrlKeyCode) {
			ctrlDown = false;
			evt.stopPropagation();
			evt.preventDefault();
		}
	};

	//
	// Bit
	//
	$scope.addNewDriver0Node = function () {
		BitService.addNewDriverNode(0, nextNodeID, function (node, id) {
			$scope.chartViewModel.addNode(node);
			nextNodeID = id;
		});
	};
	$scope.addNewDriver1Node = function () {
		BitService.addNewDriverNode(1, nextNodeID, function (node, id) {
			$scope.chartViewModel.addNode(node);
			nextNodeID = id;
		});
	};

	//
	// IO
	//
	$scope.addNewInputNode = function () {
		IOService.addNewInputNode(nextNodeID, function (node, id) {
			$scope.chartViewModel.addNode(node);
			nextNodeID = id;
		});
	};
	$scope.addNewOutputNode = function () {
		IOService.addNewOutputNode(nextNodeID, function (node, id) {
			$scope.chartViewModel.addNode(node);
			nextNodeID = id;
		});
	};

	//
	// Logic gates
	//
	$scope.addNewNotNode = function () {
		LogicService.addNewNotNode(nextNodeID, function (node, id) {
			$scope.chartViewModel.addNode(node);
			nextNodeID = id;
		});
	};
	$scope.addNewAndNode = function () {
		LogicService.addNewAndNode(nextNodeID, function (node, id) {
			$scope.chartViewModel.addNode(node);
			nextNodeID = id;
		});
	};
	$scope.addNewOrNode = function () {
		LogicService.addNewOrNode(nextNodeID, function (node, id) {
			$scope.chartViewModel.addNode(node);
			nextNodeID = id;
		});
	};
	$scope.addNewXorNode = function () {
		LogicService.addNewXorNode(nextNodeID, function (node, id) {
			$scope.chartViewModel.addNode(node);
			nextNodeID = id;
		});
	};

	//
	// Comb
	//
	$scope.addNewMuxNode = function () {
		CombService.addNewMuxNode(nextNodeID, function (node, id) {
			$scope.chartViewModel.addNode(node);
			nextNodeID = id;
		});
	};
	$scope.addNewDecNode = function () {
		CombService.addNewDecNode(nextNodeID, function (node, id) {
			$scope.chartViewModel.addNode(node);
			nextNodeID = id;
		});
	};

	//
	// Sec
	//
	$scope.addNewDivNode = function () {
		SecService.addNewDivNode(nextNodeID, function (node, id) {
			$scope.chartViewModel.addNode(node);
			nextNodeID = id;
		});
	};
	$scope.addNewCounterNode = function () {
		SecService.addNewCounterNode(nextNodeID, function (node, id) {
			$scope.chartViewModel.addNode(node);
			nextNodeID = id;
		});
	};
	$scope.addNewFlipflopNode = function () {
		SecService.addNewFlipflopNode(nextNodeID, function (node, id) {
			$scope.chartViewModel.addNode(node);
			nextNodeID = id;
		});
	};
	$scope.addNewNotesNode = function () {
		SecService.addNewNotesNode(nextNodeID, function (node, id) {
			$scope.chartViewModel.addNode(node);
			nextNodeID = id;
		});
	};

	//
	// Label
	//
	$scope.addNewLabelInputNode = function () {
		LabelService.addNewLabelInputNode(nextNodeID, function (node, id) {
			$scope.chartViewModel.addNode(node);
			nextNodeID = id;
		});
	};
	$scope.addNewLabelOutputNode = function () {
		LabelService.addNewLabelOutputNode(nextNodeID, function (node, id) {
			$scope.chartViewModel.addNode(node);
			nextNodeID = id;
		});
	};

	// Delete selected nodes and connections.
	$scope.deleteSelected = function () {
		$scope.chartViewModel.deleteSelected();
	};

	// Show/Hide verilog editor
	$scope.toggleEditor = function () {
		document.getElementById('editor').style.opacity = '1.0';
		document.getElementById('editor').style.visibility = 'visible';
		$scope.showEditor = !$scope.showEditor;
		if ($scope.showEditor) {
			document.getElementById('BQLogo').style.opacity = '0.0';
			document.getElementById('warning').style.opacity = '0.0';
			document.getElementById('editor').style.height = '280px';
		}
		else {
			document.getElementById('editor').style.height = '0px';
			document.getElementById('BQLogo').style.opacity = '1.0';
			document.getElementById('warning').style.opacity = '1.0';
		}
	};

    // Show pinout
    $scope.pinout = function () {
		document.getElementById('pinout').style.opacity = '1.0';
		document.getElementById('pinout').style.visibility = 'visible';
        $scope.showPinout = !$scope.showPinout;
		if ($scope.showPinout) {
            if ($scope.showEditor) $scope.toogleEditor();
			document.getElementById('BQLogo').style.opacity = '0.0';
			document.getElementById('warning').style.opacity = '0.0';
			document.getElementById('pinout').style.height = '490px';
			document.getElementById('pinout-img').style.height = '490px';
		} else {
			document.getElementById('pinout').style.height = '0px';
            document.getElementById('pinout-img').style.height = '0px';
			document.getElementById('BQLogo').style.opacity = '1.0';
			document.getElementById('warning').style.opacity = '1.0';
		}
    }
}]);
