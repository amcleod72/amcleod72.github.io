<script runat="server" language="JavaScript">
	Platform.Load("core","1");

	// Create a random number to emulate decisioning
    var rand = Math.floor(Math.random() * 5);

    if (rand == 1){
        Platform.Response.Redirect("https://amcleod72.github.io/routes/controlpath.json");
    } else {
        Platform.Response.Redirect("https://amcleod72.github.io/routes/targetpath.json");
    }
</script>
