#I dont love the style of the buttons right now but this is placeholder
#Maybe do something that runs edge detection on the clouds?
#or just shows through the clouds to the ground a bit?

extends TextureButton

var position


func _ready():
	set_texture_scale(get_size())
	#the alpha value of the buttons
	get_material().set_shader_param("tint", 0.4)


##various callbacks generated by the connect button in editor
func _on_MapButton_resized():
	set_texture_scale(get_size())

func _on_MapButton_pressed():
	get_parent().emit_signal("child_pressed", position)

func _on_MapButton_mouse_enter():
	get_material().set_shader_param("id", get_parent().get_pos()+get_pos())
	get_material().set_shader_param("buttonSize", get_parent().buttonSize)
	get_material().set_shader_param("resolution", global.size)