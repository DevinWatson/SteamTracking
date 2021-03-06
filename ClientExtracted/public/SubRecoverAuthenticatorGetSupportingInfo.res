"Public/SubRecoverAuthenticatorGetSupportingInfo.res"
{
	"SubRecoverAuthenticatorGetSupportingInfo"
	{
		"ControlName"		"WizardSubPanel"
		"fieldName"		"SubRecoverAuthenticatorGetSupportingInfo"
		"xpos"		"5"
		"ypos"		"29"
		"wide"		"370"
		"tall"		"211"
		"autoResize"		"0"
		"pinCorner"		"0"
		"visible"		"1"
		"enabled"		"1"
		"tabPosition"		"0"
		"WizardWide"		"0"
		"WizardTall"		"0"
	}

	"Label1"
	{
		"ControlName"		"Label"
		"fieldName"		"Label1"
		"xpos"		"24"
		"ypos"		"18"
		"wide"		"325"
		"tall"		"48"
		"autoResize"		"0"
		"pinCorner"		"0"
		"visible"		"1"
		"enabled"		"1"
		"tabPosition"		"0"
		"labelText"		"#Steam_RecoverAuthenticator_Authorization"
		"textAlignment"		"north-west"
		"dulltext"		"0"
		"brighttext"		"0"
		"wrap"		"1"
	}

	"Label3"
	{
		"ControlName"		"Label"
		"fieldName"		"Label3"
		"xpos"		"24"
		"ypos"		"66"
		"wide"		"325"
		"tall"		"24"
		"autoResize"		"0"
		"pinCorner"		"0"
		"visible"		"1"
		"enabled"		"1"
		"tabPosition"		"0"
		"labelText"		"#Steam_RecoverAuthenticator_VerificationExposition"
		"textAlignment"		"west"
		"associate"		"VerificationCode"
		"dulltext"		"1"
		"brighttext"		"0"
		"wrap"		"1"
	}
	"Label2"
	{
		"ControlName"		"Label"
		"fieldName"		"Label2"
		"xpos"		"24"
		"ypos"		"90"
		"wide"		"112"
		"tall"		"24"
		"autoResize"		"0"
		"pinCorner"		"0"
		"visible"		"1"
		"enabled"		"1"
		"tabPosition"		"0"
		"labelText"		"#Steam_RecoverAuthenticator_VerificationCode"
		"textAlignment"		"west"
		"associate"		"VerificationCode"
		"dulltext"		"1"
		"brighttext"		"0"
		"wrap"		"0"
	}
	"VerificationCode"
	{
		"ControlName"		"TextEntry"
		"fieldName"		"VerificationCode"
		"xpos"		"148"
		"ypos"		"90"
		"wide"		"140"
		"tall"		"24"
		"autoResize"		"0"
		"pinCorner"		"0"
		"visible"		"1"
		"enabled"		"1"
		"tabPosition"		"1"
		"textHidden"		"0"
		"editable"		"1"
		"maxchars"		"-1"
		"NumericInputOnly"		"0"
		"unicode"		"0"
	}

	"Label4"
	{
		"ControlName"	"Label"
		"fieldName"		"Label4"
		"xpos"			"24"
		"ypos"			"162"
		"wide"			"325"
		"tall"			"48"
		"autoResize"	"0"
		"pinCorner"		"0"
		"visible"		"1"
		"enabled"		"1"
		"tabPosition"	"0"
		"labelText"		"#Steam_RecoverAuthenticator_RevocationExposition"
		"textAlignment"	"west"
		"associate"		"RevocationCode"
		"dulltext"		"1"
		"brighttext"	"0"
		"wrap"			"1"
	}
	"Label5"
	{
		"ControlName"		"Label"
		"fieldName"		"Label5"
		"xpos"		"24"
		"ypos"		"210"
		"wide"		"124"
		"tall"		"24"
		"autoResize"		"0"
		"pinCorner"		"0"
		"visible"		"1"
		"enabled"		"1"
		"tabPosition"		"0"
		"labelText"		"#Steam_RecoverAuthenticator_RevocationCode"
		"textAlignment"		"west"
		"associate"		"RevocationCode"
		"dulltext"		"1"
		"brighttext"		"0"
		"wrap"		"0"
	}
	"RecoveryCode"
	{
		"ControlName"		"TextEntry"
		"fieldName"		"RevocationCode"
		"xpos"		"148"
		"ypos"		"210"
		"wide"		"140"
		"tall"		"24"
		"autoResize"		"0"
		"pinCorner"		"0"
		"visible"		"1"
		"enabled"		"1"
		"tabPosition"		"2"
		"textHidden"		"0"
		"editable"		"1"
		"maxchars"		"-1"
		"NumericInputOnly"		"0"
		"unicode"		"0"
	}

}
