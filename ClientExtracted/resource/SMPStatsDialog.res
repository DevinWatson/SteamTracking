"resource/SMPStatsDialog.res"
{
	"smp stats frame"
	{
		"ControlName"		"Frame"
		"fieldName"		"smp stats frame"
		"xpos"		"842"
		"ypos"		"223"
		"wide"		"320"
		"tall"		"535"
		"AutoResize"		"0"
		"PinCorner"		"0"
		"visible"		"1"
		"enabled"		"1"
		"tabPosition"		"0"
		"paintbackground"		"1"
		"settitlebarvisible"		"1"
		"title"		"#SMPStats_DialogTitle"

		"question text"
		{
			"ControlName"		"TextEntry"
			"fieldName"		"question text"
			"xpos"		"8"
			"ypos"		"48"
			"wide"		"304"
			"tall"		"160"
			"AutoResize"		"1"
			"PinCorner"		"0"
			"visible"		"1"
			"enabled"		"1"
			"tabPosition"		"0"
			"paintbackground"		"1"
			"textHidden"		"0"
			"editable"		"0"
			"maxchars"		"-1"
			"NumericInputOnly"		"0"
			"unicode"		"0"
			"text"		"#SmpStats_PrivacyNotice"
			"multiline"		"1"
		}
		"uid label"
		{
			"ControlName"		"Label"
			"fieldName"		"uid label"
			"xpos"		"8"
			"ypos"		"216"
			"wide"		"60"
			"tall"		"20"
			"AutoResize"		"0"
			"PinCorner"		"0"
			"visible"		"1"
			"enabled"		"1"
			"tabPosition"		"0"
			"paintbackground"		"1"
			"labelText"		"#SMPStats_UserId"
			"textAlignment"		"west"
			"wrap"		"0"
		}
		"uid text"
		{
			"ControlName"		"TextEntry"
			"fieldName"		"uid text"
			"xpos"		"70"
			"ypos"		"216"
			"wide"		"242"
			"tall"		"20"
			"AutoResize"		"1"
			"PinCorner"		"0"
			"visible"		"1"
			"enabled"		"1"
			"tabPosition"		"0"
			"paintbackground"		"1"
			"textHidden"		"0"
			"editable"		"0"
			"maxchars"		"-1"
			"NumericInputOnly"		"0"
			"unicode"		"0"
		}
		"file label"
		{
			"ControlName"		"Label"
			"fieldName"		"file label"
			"xpos"		"9"
			"ypos"		"243"
			"wide"		"60"
			"tall"		"20"
			"AutoResize"		"0"
			"PinCorner"		"0"
			"visible"		"1"
			"enabled"		"1"
			"tabPosition"		"0"
			"paintbackground"		"1"
			"labelText"		"#SMPStats_Filename"
			"textAlignment"		"west"
			"wrap"		"0"
		}
		"file text"
		{
			"ControlName"		"TextEntry"
			"fieldName"		"file text"
			"xpos"		"70"
			"ypos"		"243"
			"wide"		"242"
			"tall"		"20"
			"AutoResize"		"1"
			"PinCorner"		"0"
			"visible"		"1"
			"enabled"		"1"
			"tabPosition"		"0"
			"paintbackground"		"1"
			"textHidden"		"0"
			"editable"		"0"
			"maxchars"		"-1"
			"NumericInputOnly"		"0"
			"unicode"		"0"
		}
		"data panel"
		{
			"ControlName"		"ListPanel"
			"fieldName"		"data panel"
			"xpos"		"8"
			"ypos"		"272"
			"wide"		"303"
			"tall"		"190"
			"AutoResize"		"3"
			"PinCorner"		"0"
			"visible"		"1"
			"enabled"		"1"
			"tabPosition"		"0"
			"paintbackground"		"1"
		}
		"dontask check"
		{
			"ControlName"		"CheckButton"
			"fieldName"		"dontask check"
			"xpos"		"8"
			"ypos"		"472"
			"wide"		"242"
			"tall"		"20"
			"AutoResize"		"0"
			"PinCorner"		"2"
			"visible"		"1"
			"enabled"		"1"
			"tabPosition"		"0"
			"paintbackground"		"1"
			"labelText"		"#SMPStats_DontAskAgain"
			"selected"		"1"
		}
		"accept button"
		{
			"ControlName"		"Button"
			"fieldName"		"accept button"
			"xpos"		"32"
			"ypos"		"497"
			"wide"		"64"
			"tall"		"24"
			"AutoResize"		"0"
			"PinCorner"		"2"
			"visible"		"1"
			"enabled"		"1"
			"tabPosition"		"0"
			"paintbackground"		"1"
			"labelText"		"#vgui_Accept"
			"textAlignment"		"west"
			"wrap"		"0"
			"Command"		"accept"
			"Default"		"1"
		}
		"decline button"
		{
			"ControlName"		"Button"
			"fieldName"		"decline button"
			"xpos"		"222"
			"ypos"		"497"
			"wide"		"64"
			"tall"		"24"
			"AutoResize"		"0"
			"PinCorner"		"3"
			"visible"		"1"
			"enabled"		"1"
			"tabPosition"		"0"
			"paintbackground"		"1"
			"labelText"		"#vgui_Decline"
			"textAlignment"		"west"
			"wrap"		"0"
			"Command"		"decline"
			"Default"		"0"
		}
	}
}
