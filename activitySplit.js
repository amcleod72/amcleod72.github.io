<script runat="server" language="JavaScript">
	Platform.Load("core","1");

	// Data Extension used for logging - use External keyValue
	var DE = DataExtension.Init("ControlGroupLog");
	var confirmation;

	// Get the payload posted to this page
	var obj = Platform.Function.ParseJSON(Platform.Request.GetPostData("UTF-8"));

	// Size is the percentage of contacts that should be placed in the control group
	var size = obj.inArguments[0].size;

	var row =	[{
		ContactKey:				obj.keyValue,
		JourneyVersionID:		obj.journeyId,
		ActivityId:				obj.activityId,
		ActivityObjectID:		obj.activityObjectID,
		DefinitionInstanceId:	obj.definitionInstanceId,
		ActivityInstanceId:		obj.activityInstanceId
	}];

	var outcome = getPath(size);

    if (outcome == "control"){
		row[0].IsControl = 1;
		confirmation = "https://amcleod72.github.io/routes/controlpath.json"
    } else {
		row[0].IsControl = 0;
		confirmation = "https://amcleod72.github.io/routes/targetpath.json"
    }

	DE.Rows.Add(row);
	Platform.Response.Redirect(confirmation);


	function getPath (controlSize) {
		// Avoid divide by zero issues where control is zero per cent
		if (controlSize == 0){
			//return "target";
			return "target";
		} else {
			// generate a random integer between 1 and
			var max = 100/controlSize;
			var randVal = Math.floor(Math.random() * max) + 1;

			if (randVal == 1){
				return "control";
			} else {
				//return "target";
				return "target";
			}
		}
	}
</script>
