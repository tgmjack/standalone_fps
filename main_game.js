// sort out the over use of var

score = document.getElementById("the score");
hud_health = document.getElementById("health");
game_over_div = document.getElementById("game over");
hud_pistol = document.getElementById("pistol_ammo");
hud_mg = document.getElementById("mg_ammo");
hud_shotty = document.getElementById("shotty_ammo");
hud_pistol_img = document.getElementById("pistol_image");
hud_mg_img = document.getElementById("mg_image");
hud_shotty_img = document.getElementById("shotty_image");
radar_canvas = document.getElementById("canvas_raycasting_radar");
radar_ctx = radar_canvas.getContext("2d");
main_screen = document.getElementById("main_screen");
screen_ctx = main_screen.getContext("2d");



let testing_bool = 0;
let shooting = 0;
let gun_fire_counter = 0;
let a_key_pressed = 0;
let keycode_pressed = "none";
let enemy_id_counter = 0
let pickup_id_counter = 0
let door_object_id_counter = 0;


const FOV = Math.PI / 3
const HALF_FOV = FOV / 2
const NUM_RAYS = 100
const MAX_DEPTH = 6
const DELTA_ANGLE = FOV / NUM_RAYS
const SCREEN_DIST = main_screen.width / 2 / math.tan(HALF_FOV)
const SCALE = math.floor(main_screen.width / NUM_RAYS)

const TEXTURE_SIZE = 500
const HALF_TEXTURE_SIZE = TEXTURE_SIZE / 2



let stuff_to_draw_this_frame = []
let dt =0.01

let pickup_object_index_counter = 0
let out_of_ammo_bool = 0

let number_of_times_space_pressed = 0

let images_loaded = 0
const num_of_images = 42;


function load_door_sprites(door_images_list){
    var door_images_list_path = [];
    for (let i = 1; i <= 13; i++) {
        if (i==1){door_images_list_path.push(`static/door_alpha.png`);}
        else{door_images_list_path.push(`static/door${i}_alpha.png`);}
    }
    
    door_images_list_path.forEach(imageURL => {
        const image = new Image();
        image.src = imageURL;
        image.onload = imageLoaded;
        door_images_list.push(image);
    });
    return door_images_list
}

function load_normal_zombie_sprites(zombie_walk_sprites){
    var zombie_walk_sprites_path = [];
    for (let i = 1; i <= 17; i++) {
        zombie_walk_sprites_path.push(`static/brand new zombies/alphad/${i}.png`);
    }
    
    zombie_walk_sprites_path.forEach(imageURL => {
        const image = new Image();
        image.src = imageURL;
        image.onload = imageLoaded;
        zombie_walk_sprites.push(image);
    });
    return zombie_walk_sprites
}

function load_tough_zombie_sprites(tough_zombie_walk_sprites){
    var tough_zombie_walk_sprites_path = [];
    for (let i = 1; i <= 17; i++) {
        tough_zombie_walk_sprites_path.push(`static/brand new zombies/alphad/tough${i}.png`);
    }
    
    tough_zombie_walk_sprites_path.forEach(imageURL => {
        const image = new Image();
        image.src = imageURL;
        image.onload = imageLoaded;
        tough_zombie_walk_sprites.push(image);
    });
    return tough_zombie_walk_sprites
}


var tough_zombie_walk_sprites = [];
var zombie_walk_sprites = [];
var door_images_list = [];
door_images_list = load_door_sprites(door_images_list)
zombie_walk_sprites = load_normal_zombie_sprites(zombie_walk_sprites)
tough_zombie_walk_sprites = load_tough_zombie_sprites(tough_zombie_walk_sprites)
zombie_idle = zombie_walk_sprites[0]
tough_zombie_idle = tough_zombie_walk_sprites[0]


let gun_img = new Image();
const floor_mg_image = new Image();
const pistol_img = new Image();
const shooting_1_pistol_img = new Image();
const shooting_2_pistol_img = new Image();
const mg_img = new Image();
const shooting_1_mg_img = new Image();
const shooting_2_mg_img = new Image();
const bricks_texture = new Image();

var click_img_1 = new Image();
var click_img_2 = new Image();
var click_img_3 = new Image();
var click_img_4 = new Image();
click_img_1.src = 'static/click 1.png';
click_img_2.src = 'static/click 2.png';
click_img_3.src = 'static/click 3.png';
click_img_4.src = 'static/click 4.png';
var points_object_image = new Image();
points_object_image.src = 'static/points_object_alpha.png';
gun_img = pistol_img

var pickup_objects = []


pistol_img.src = 'static/pistol hand 2 alpha.png';
shooting_1_pistol_img.src = 'static/pistol 2 hand 1 shoot 1 alpha.png';
shooting_2_pistol_img.src = 'static/pistol 2 hand 1 shoot 2 alpha.png';
mg_img.src = 'static/new mg fps hand alpha.png';
shooting_1_mg_img.src = 'static/new mg fps hand  shot 1 alpha.png';
shooting_2_mg_img.src = 'static/new mg fps hand  shot 2 alpha.png';
bricks_texture.src = 'static/bricks.png';
floor_mg_image.src = 'static/mg1_alpha.png';
pistol_img.onload = imageLoaded;
floor_mg_image.onload = imageLoaded;
zombie_idle.onload = imageLoaded;
shooting_1_pistol_img.onload = imageLoaded;
shooting_2_pistol_img.onload = imageLoaded;
bricks_texture.onload = imageLoaded;
mg_img.onload = imageLoaded;
shooting_1_mg_img.onload = imageLoaded;
shooting_2_mg_img.onload = imageLoaded;
points_object_image.onload = imageLoaded;
click_img_1.onload = imageLoaded;
click_img_2.onload = imageLoaded;
click_img_3.onload = imageLoaded;
click_img_4.onload = imageLoaded;
click_images = [click_img_1,click_img_2,click_img_3,click_img_4]



var gun_images = []
var door_objects_list = []
var click_images = []
var enemies = []
var current_gun_img = gun_img

function imageLoaded() {
    images_loaded++; 
    if (images_loaded === num_of_images) {
      // All images have loaded
      start_game();
    }
  }

function display_click(index)
{
    screen_ctx.drawImage(click_images[index], 0, 0);
}

class class_gun_images
{
    constructor(standard, shooting1, shooting2)
    {
    this.standard = standard
    this.shooting1 = shooting1
    this.shooting2 = shooting2
    }
}

function handle_specific_hud_element(hud_element, hud_element_image , value){
    if (value == "no"){
    hud_element.innerHTML = 0
    hud_element_image.tint_grey
                    }
    else if (value == -1) {
    hud_element.innerHTML = "&#8734;"
    }
    else{
    hud_element_image.untint_grey
    hud_element.innerHTML = value
        }
}

function update_hud(){
    hud_health.innerHTML = mi_player.health
    handle_specific_hud_element(hud_pistol , hud_pistol_img, mi_player.weapons[0])
    handle_specific_hud_element(hud_mg , hud_mg_img, mi_player.weapons[1])
    handle_specific_hud_element(hud_shotty , hud_shotty_img, mi_player.weapons[2])
}

// 2 = closed door
// 3 = open
// 4 = opening
if (testing_bool == 0){
var mini_map = [[1,1,1,1,1,1,1,1,1],[1,0,0,0,0,0,1,1,1],[1,0,0,0,0,0,1,1,1],[1,0,0,1,1,0,1,1,1],[1,1,2,1,0,0,1,1,1],[1,0,0,0,0,0,2,0,1],[1,2,1,1,1,1,1,0,1],[1,0,0,0,0,0,0,0,1],[1,1,1,1,1,1,1,1,1]]
}
else{
    var mini_map = [[1,1,1,1,1],[1,0,0,0,1],[1,2,1,0,1],[1,0,0,0,1],[1,1,1,1,1]]
}

class sprite
{
    constructor(image , x , y , id, is_enemy)
    {
    this.x = x
    this.y = y
    this.image = image
    this.id = id
    this.image_width = this.image.width
    this.screen_x = "non"
    this.image_ratio = this.image_width / this.image.height
    this.is_enemy = is_enemy;
    this.normal_dist = "non";
    this.dist_between_player = "non";
    this.player_viewing_angle = 'non'
    this.SPRITE_SCALE = 0.7;
    this.SPRITE_HEIGHT_SHIFT = 0.27
    }

    get_sprite_proj()
    {
    let proj_height = SCREEN_DIST / this.normal_dist * this.SPRITE_SCALE;
    let proj_width = proj_height * this.image_ratio;
    let offset = 1;
    let texture_height = 1;
    let height_shift = 1;
    height_shift = proj_height * this.SPRITE_HEIGHT_SHIFT
    let x = this.screen_x-(proj_width/2)
    let y = main_screen.height / 2 -( proj_height / 2) + height_shift
    var info = "";
    if (this.is_enemy){info = "a enemy sprite"}else{info = "a object sprite"}
    stuff_to_draw_this_frame.push(new a_thing_to_draw_this_frame(this.image ,x , y , proj_width , proj_height , "nope", "nope", "nope", "nope", math.pow( math.pow((mi_player.x - this.x),2)+ math.pow((mi_player.y - this.y),2) , 0.5), info  , this.id))
    }

    positioning() // get sprite
    {
        let dx = this.x - mi_player.x;
        let dy = this.y - mi_player.y;
        this.player_viewing_angle = math.atan2(dy,dx)
        let angle_diff = this.player_viewing_angle - mi_player.angle

        if ((dx > 0 && mi_player.angle > math.pi) || (dx < 0 && dy < 0)){console.log("  this if statement ");angle_diff+= (3.1415926535 * 2)}
        let rays_offcentre = angle_diff / DELTA_ANGLE
        this.screen_x = (NUM_RAYS/2 + rays_offcentre) * SCALE
        this.dist_between_player = math.pow(math.pow(dx, 2) + math.pow(dy,2) , 0.5)
        this.normal_dist = this.dist_between_player * math.cos(angle_diff)
        if ((this.image_width/2< this.screen_x < (SCREEN_DIST + this.image_width/2)) && this.normal_dist > 0.04 && angle_diff < 0.7 && angle_diff > -0.7)
        {
        this.get_sprite_proj()
        }
        else { console.log("not getting sprite pos");}

    }
}


class pickup_object {
    constructor(pickup_type , x , y ){
        this.pickup_range = 0.3;
        this.pickup_type = pickup_type
        this.x = x
        this.y = y
        this.id = pickup_id_counter
        this.score_for_picking_up;

        if (pickup_type == 0){
        this.score_for_picking_up = 50
        var the_image = points_object_image
        }
        if (pickup_type == 1)
        {
        this.score_for_picking_up = 0
        var the_image = floor_mg_image
        }
        this.sprite = new sprite(the_image , x , y , pickup_id_counter , false)
        pickup_id_counter++
    }

    do_stuff(){
    let dx = mi_player.x - this.x
    let dy = mi_player.y - this.y
    if (math.hypot(dy, dx) < this.pickup_range)
    {
        this.picked_up()
    }
    }

    picked_up(){
        if (this.pickup_type == 0 )
        {
        score.innerHTML = parseInt(score.innerHTML)+this.score_for_picking_up
        for (var i = 0; i < pickup_objects.length; i++) {
            if (pickup_objects[i].id == this.id){pickup_objects.splice(i, 1)}
        }
        }

        if (this.pickup_type == 1 )
        {mi_player.pickup(1)
        for (var i = 0; i < pickup_objects.length; i++) {
        if (pickup_objects[i].id == this.id){pickup_objects.splice(i, 1)}
        }

        }
                }
}


class map{
    constructor(the_map)
    {
    this.mini_map = the_map
    this.rows = this.mini_map.length
    this.cols = this.mini_map[0].length

    }

    draw_mini_map(){
    radar_ctx.beginPath();
    radar_ctx.clearRect(0, 0, radar_canvas.width, radar_canvas.height);
    radar_ctx.fillStyle = "white";
    radar_ctx.fillRect(0, 0 , radar_canvas.width, radar_canvas.height);
    radar_ctx.stroke();
    for (let y = 0; y < this.mini_map.length; y++)
    {
        for (let x = 0; x < this.mini_map[y].length; x++)
        {
        if (this.mini_map[x][y]==1)
                {
        radar_ctx.fillStyle = "green";
        radar_ctx.fillRect(x*width_of_each_tile, y*height_of_each_tile , width_of_each_tile, height_of_each_tile);
        radar_ctx.stroke();
                }
        else if (this.mini_map[x][y]==2)
                    {
                radar_ctx.fillStyle = "blue";
                radar_ctx.fillRect(x*width_of_each_tile, y*height_of_each_tile , width_of_each_tile, height_of_each_tile);
                radar_ctx.stroke();
                    }
            else{
                }
        }
    }
    radar_ctx.closePath();
    radar_ctx.stroke();

    radar_ctx.strokeStyle = "black";
    var player_x = mi_player.x*width_of_each_tile
    var player_y = mi_player.y*height_of_each_tile
    radar_ctx.moveTo(player_x , player_y);
    radar_ctx.lineTo( player_x+2 , player_y+2);
    radar_ctx.stroke();


    radar_ctx.strokeStyle = "blue";
    radar_ctx.fillStyle = "blue";
    for (var pickup_object = 0; pickup_object < pickup_objects.length; pickup_object++) {
        let this_e_x = pickup_objects[pickup_object].x*width_of_each_tile
        let this_e_y = pickup_objects[pickup_object].y*height_of_each_tile
        radar_ctx.beginPath();
        radar_ctx.arc(this_e_x, this_e_y, 1, 0, 2 * math.PI);
        radar_ctx.closePath();
        radar_ctx.stroke();
    }



    radar_ctx.strokeStyle = "red";
    radar_ctx.fillStyle = "red";
    for (var enemy = 0; enemy < enemies.length; enemy++) {
        let this_e_x = enemies[enemy].x*width_of_each_tile
        let this_e_y = enemies[enemy].y*height_of_each_tile
        radar_ctx.beginPath();
        radar_ctx.arc(this_e_x, this_e_y, 1, 0, 2 * math.PI);
        radar_ctx.closePath();
        radar_ctx.stroke();
    }


    radar_ctx.strokeStyle = "black";
    radar_ctx.beginPath();

    }
}

var mi_map = new map(mini_map)
var width_of_each_tile = radar_canvas.width/(mi_map.mini_map.length);
var height_of_each_tile = radar_canvas.height/(mi_map.mini_map[0].length);



class player{
    constructor(){
                this.health = 100;
                this.selected_weapon = 0;
                if (testing_bool == 0){
                this.x = 1.5
                this.y = 1.5
                this.angle = 0
                this.move_speed = 0.03
                this.rotate_speed =0.05
                this.weapons = [-1 , "no" , "no"] // -1 = infinite ammo
                }
                else{
                this.x = 1.9
                this.y = 1.9
                this.angle = -1.61
                this.move_speed = 0.03
                this.rotate_speed =0.05
                this.weapons = [-1 , "no" , "no"] // -1 = infinite ammo
                }
                this.map_pos = [Math.floor(this.x), Math.floor(this.y)]
                }
    pickup(pickup_type)
    {
    if (pickup_type == 1 || pickup_type == 2)
    {
        var ammo_amount = 0
        if (pickup_type == 1){ammo_amount = 60}// mg
        if (pickup_type == 2){ammo_amount = 12}// shotty
        if (this.weapons[pickup_type] == "no"){this.weapons[pickup_type] = ammo_amount}
        else{
        if (this.weapons[pickup_type] != -1){this.weapons[pickup_type] += ammo_amount}}
    }

    }
    regularizer()
    {

    while (0 > this.angle)
    { 
        this.angle += 6.2831
    }
    while (this.angle > 6.28319)
    {
        this.angle += -6.2831
    }

    }
    update_map_pos()
    {
    this.map_pos = [Math.floor(this.x), Math.floor(this.y)]
    }
    move(event)
        {
        if (this.angle == 0){this.angle = 0.00001}
        var sin_angle = math.sin(this.angle)
        var cos_angle = math.cos(this.angle)
        var frame_speed = this.move_speed * 1
        var speed_y = frame_speed * sin_angle
        var speed_x = frame_speed * cos_angle
        var key_code = keycode_pressed
        // moving forwards and backwards
        if (key_code == 49)
        {
            this.swap_weapon(0)
        }
        else {
            if(key_code == 50)
            {
            this.swap_weapon(1)
            }
        }
        if (key_code == 37 || key_code == 39 || key_code == 83 || key_code == 87 || key_code == 119|| key_code == 115)
            {
            if ( key_code == 37 || key_code == 87 || key_code == 119) {
                    // w
                    if (mi_map.mini_map[math.floor(mi_player.x + (speed_x*2))][math.floor(mi_player.y + (speed_y*2))]==0 || mi_map.mini_map[math.floor(mi_player.x + (speed_x*2))][math.floor(mi_player.y + (speed_y*2))]==3)
                    {
                    this.y += speed_y
                    this.x += speed_x
                    }
                                                                       }
            if (key_code == 39 || key_code == 83 || key_code == 115) {
                    // s
                    if (mi_map.mini_map[math.floor(mi_player.x - (speed_x*2))][math.floor(mi_player.y - (speed_y*2))]==0  || mi_map.mini_map[math.floor(mi_player.x - (speed_x*2))][math.floor(mi_player.y - (speed_y*2))]==3)
                    {
                    this.y += -speed_y
                    this.x += -speed_x
                    }
                                                                    }
            }
            if (key_code == 32)
            {
                number_of_times_space_pressed+=1
                console.log(" zombargar space pressed " , number_of_times_space_pressed)
                for (var door_id = 0; door_id < door_objects_list.length; door_id++) {
                            if ((mi_map.mini_map[math.floor(mi_player.x + (speed_x*2))][math.floor(mi_player.y + (speed_y*2))]==2   &&   door_objects_list[door_id].x == math.floor(mi_player.x + (speed_x*2)) && door_objects_list[door_id].y == math.floor(mi_player.y + (speed_y*2)))  ||       (mi_map.mini_map[math.floor(mi_player.x + (speed_x*13))][math.floor(mi_player.y + (speed_y*13))]==2   &&   door_objects_list[door_id].x == math.floor(mi_player.x + (speed_x*13)) && door_objects_list[door_id].y == math.floor(mi_player.y + (speed_y*13))))
                            {
                                door_objects_list[door_id].start_opening()
                            }
                                                                        }
            }

            if (key_code == 113){
            sin_angle = math.sin(this.angle-1.5708);  cos_angle = math.cos(this.angle-1.5708); speed_y = frame_speed * sin_angle; speed_x = frame_speed * cos_angle;
            if (mi_map.mini_map[math.floor(mi_player.x + (speed_x*2))][math.floor(mi_player.y + (speed_y*2))]==0  || mi_map.mini_map[math.floor(mi_player.x + (speed_x*2))][math.floor(mi_player.y + (speed_y*2))]==3)
            {
            this.y += speed_y;  this.x += speed_x
            }
                                }
            if (key_code == 101){
            sin_angle = math.sin(this.angle+1.5708);  cos_angle = math.cos(this.angle+1.5708); speed_y = frame_speed * sin_angle; speed_x = frame_speed * cos_angle;
            if (mi_map.mini_map[math.floor(mi_player.x + (speed_x*2))][math.floor(mi_player.y + (speed_y*2))]==0  || mi_map.mini_map[math.floor(mi_player.x + (speed_x*2))][math.floor(mi_player.y + (speed_y*2))]==3)
            {
            this.y += speed_y;  this.x += speed_x
                }
                                }

            if (key_code == 122)
            {
            if (shooting == 0){
                console.log("bang 0 ")
                if (this.weapons[this.selected_weapon] != 0   && this.weapons[this.selected_weapon] != "no")
                {
                shooting = 1;
                var bullet_hit_something = false;
                if (this.weapons[this.selected_weapon] != -1)
                {
                    console.log("ammo went from ",this.weapons[this.selected_weapon])
                    this.weapons[this.selected_weapon] += - 1
                    console.log(" to ",this.weapons[this.selected_weapon])
                }
                for (var i = 0; i < enemies.length; i++) {
                    if (bullet_hit_something == false){
                    for(var j = 0; j < stuff_to_draw_this_frame.length; j++){
                    if (stuff_to_draw_this_frame[j].info == "a enemy sprite"){
                    if (enemies[i].id ==stuff_to_draw_this_frame[j].id){
                        if (stuff_to_draw_this_frame[j].clip_x < main_screen.width/2 && main_screen.width/2 < stuff_to_draw_this_frame[j].clip_x+stuff_to_draw_this_frame[j].dx_clip)
                                        {
                                            var damage = 10
                                            bullet_hit_something = true;
                                            if(mi_player.selected_weapon == 1){damage = 20}

                                            enemies[i].being_shot(damage)

                                        }
                        else {console.log("not x < middle < x+width " , stuff_to_draw_this_frame[j].clip_x , main_screen.width/2 , stuff_to_draw_this_frame[j].clip_x+stuff_to_draw_this_frame[j].dx_clip)}
                    } else
                    {
            //            console.log(enemies[i].id , stuff_to_draw_this_frame[j].id , "   =   enemies[i].id , stuff_to_draw_this_frame[j].id ")
                    }
                                                                        }
                                                                        else{console.log(stuff_to_draw_this_frame[j].info , " = stuff_to_draw_this_frame[j].info")}
                                                                    }
                                                            }

                                                        }
                                                    }
                    else{this.out_of_ammo()}
                            }
            else if (shooting == 1){
            console.log("allready shooting")
                                    }
            }

            if (key_code == 97 || key_code == 100 || key_code == 65 || key_code == 68)
            {

                if ( key_code == 97 || key_code == 65){
                    // a
                    this.angle += -this.rotate_speed
                                    }
                if (key_code == 100 || key_code == 68) {
                    // d
                    this.angle += this.rotate_speed
                                    }
            }

        }

        out_of_ammo()
        {
            out_of_ammo_bool = 1
        }

        swap_weapon(weapon_num)
        {
        console.log("doing a weapon swap init " , weapon_num)
        this.selected_weapon = weapon_num;
        current_gun_img = gun_images[weapon_num].standard
        }

        shoot(){
        }
}

var times_update_path_called = 0;

class a_star_point
{
    constructor(x , y , parent, target_dist, current_number_of_steps, node_id)
            {
    this.x = x;
    this.y = y;
    this.parent = parent;
    this.target_dist = target_dist;
    this.number_of_steps = current_number_of_steps;
    this.h = math.pow(target_dist,2) + math.pow(this.number_of_steps,0.5)
    this.node_id = node_id
            }
}

class a_thing_to_draw_this_frame
    {
    constructor(image, clip_x="nope", clip_y="nope" ,dx_clip="nope", dy_clip="nope", placing_x="nope", placing_y="nope", resize_width="nope", resize_height="nope" , dist="nope", info = "noooooooope" , id = "naaaa")
        {
            this.image = image;
            this.clip_x = clip_x
            this.clip_y = clip_y
            this.dx_clip = dx_clip
            this.dy_clip = dy_clip
            this.placing_x = placing_x
            this.placing_y = placing_y
            this.resize_width = resize_width
            this.resize_height = resize_height
            this.id = id
            this.dist = dist
            this.info = info
        }
    }
function out_of_ammo_draw()
{
    let chooser = math.random()*4
    if (chooser < 1){display_click(0)}
    else{
    if (chooser < 2){display_click(1)}
    else{
        if (chooser < 3){display_click(2)}
        else{
        if (chooser < 4){display_click(3)}
        else{
        }
        }
    }
    }
}


class door{
    constructor(x , y )
    {
    this.x = x
    this.y = y
    this.id = door_object_id_counter
    door_object_id_counter ++
    this.animation_counter = 0
    this.fully_open_counter = 0
    this.open_duration = 500
    this.total_door_opening_time = 50
    this.door_images = door_images_list
    this.door_image_index = 0
    this.frames_per_image = math.floor(this.total_door_opening_time / this.door_images.length)
    }
    get_current_texture()
    {
    return this.door_images[this.door_image_index]
    }
    currently_opening_or_closing_handler()
    {
    if (mi_map.mini_map[this.x][this.y] == 4)
    {
        if (this.animation_counter > this.frames_per_image)
        {

        this.door_image_index += 1
        this.animation_counter= 0;
        }
        this.animation_counter += 1
        if (this.door_image_index == this.door_images.length-1){mi_map.mini_map[this.x][this.y] = 3; this.animation_counter= 0;}
    }

    else{  //// closing below
        if (mi_map.mini_map[this.x][this.y] == 5){
            if (this.animation_counter > this.frames_per_image)
                {
                this.door_image_index += (-1)
                this.animation_counter= 0;
                }
                this.animation_counter += (1)
            if (this.door_image_index == 0){mi_map.mini_map[this.x][this.y] = 2; this.animation_counter= 0;}
                                                }
    else {
    if (mi_map.mini_map[this.x][this.y] == 3) {this.fully_open_counter+=1 ; if(this.fully_open_counter > this.open_duration){this.fully_open_counter = 0; this.try_close_door()}}
        else{console.log(" currently open handler, but not 3 or 4  x , y = ", this.x, this.y , "  map num = " , mi_map.mini_map[this.x][this.y] )}
        }
        }
    }


    try_close_door()
    {
    let player_under_door = false;
    let enemy_under_door = false;
    if (math.floor(mi_player.x)== this.x && math.floor(mi_player.y)== this.y)
    { player_under_door = true}
    enemies.forEach((enemy, i) => {
        if (math.floor(enemy.x)== this.x && math.floor(enemy.y)== this.y)
        { enemy_under_door = true}
    });

    if (player_under_door == false && enemy_under_door == false && mi_map.mini_map[this.x][this.y] == 3)
        {
        this.animation_counter= 0;
        mi_map.mini_map[this.x][this.y] = 5
        }

    }
    start_opening()
    {
    if (mi_map.mini_map[this.x][this.y]==2){
    mi_map.mini_map[this.x][this.y]=4
            }
    else {
        throw new Error(" trying to open a door at " , this.x , this.y, " which isnt shut, its number on the map is " , mi_map.mini_map[this.x][this.y] , "  the id is   ", this.id)
            }
    }
}



class enemy{
    constructor(x , y , idle_sprite_image , walk_sprites){
                console.log(walk_sprites)
                console.log("xxxxxxxxxxxxxxxxx walk_sprites")
                this.health = 10;
                this.x = x
                this.y = y
                this.idle_sprite = new sprite(idle_sprite_image , x , y ,enemy_id_counter , true)
                this.move_speed = 0.001
                this.rotate_speed =0.27
                this.map_pos = [Math.floor(this.x), Math.floor(this.y)]
                this.current_plan = "idle";
                this.path=[]
                this.update_path_2()
                this.path_recalc_time = 0
                this.min_attack_dist = 0.25


                this.walk_sprites = []
                this.attack_sprites = []

                for (var i = 0; i < walk_sprites.length; i++) {
                    this.walk_sprites.push(new sprite(walk_sprites[i] , x , y ,enemy_id_counter , true))
                }

                this.current_sprite = this.idle_sprite
                this.frames_per_single_attack_image = 5;
                this.frames_per_single_walk_image = 5;
                this.frames_per_attack_animation = this.attack_sprites.length / this.frames_per_single_attack_image
                this.walk_animation_counter = 0;
                this.walk_animation_index = 0;
                this.attack_counter = 0
                this.damage_per_attack = 10
                this.score_for_killing = 10;
                this.id = enemy_id_counter;
                enemy_id_counter++

                }

    walk_animation_handler(){
        this.walk_animation_counter++;
        if (this.walk_animation_counter > this.frames_per_single_walk_image)
        {
            this.walk_animation_counter = 0
            this.walk_animation_index++;
            if (this.walk_animation_index == this.walk_sprites.length)
            {
                this.walk_animation_index = 0;
                this.current_sprite = this.walk_sprites[this.walk_animation_index]
            }
            this.current_sprite = this.walk_sprites[this.walk_animation_index]
        }
    }
    update_map_pos()
    {
    this.map_pos = [Math.floor(this.x), Math.floor(this.y)]
    }

    being_shot(damage)
    {
        this.health += - damage
        if (this.health < 1)
        {
        score.innerHTML = parseInt(score.innerHTML)+this.score_for_killing
        for (var i = 0; i < enemies.length; i++) {
            if (enemies[i].id == this.id){
                    enemies.splice(i , 1)
                                        }
                                                 }
        }
    }

    update_path_2()
    {
    let number_of_steps = 0
    let found_player = 0
    times_update_path_called++
    let current_node  = new a_star_point(this.x , this.y , "start" , math.hypot((this.x - mi_player.x),(this.y - mi_player.y)), number_of_steps , 0)

    let step_size = 0.1
    let these_posibilities = [];
    let current_index = 0
    let closed = [];
    let good_options = [current_node];
    let rounds_tried = 0
    let node_id_counter = 1;
    while (found_player == 0)
        {
        rounds_tried++;

        let best_h = 99999;
        let this_h = 99999;
        let better_step_found = 0


        current_node = good_options[0]
        current_index = 0


        for (var i = 0; i < good_options.length; i++)
        {
            let this_node = good_options[i]
            if (this_node.h < current_node.h)
            {
            current_node = this_node
            current_index = i
            }
        }

        good_options.splice(current_index , 1)
        closed.push(current_node)
        let current_x = current_node.x;
        let current_y = current_node.y;
        these_posibilities = []
        for (var x = -0.1; x < 0.2; x+=step_size)
                {
                x = parseFloat(x)
                let this_x = parseFloat(parseFloat(current_x+x).toFixed(2));
                for (var y = -0.1; y < 0.2; y+=step_size)
                        {
                        y = parseFloat(y)
                        let this_y = parseFloat(parseFloat(current_y+y).toFixed(2));
                        if (mi_map.mini_map[math.floor(this_x)][math.floor(this_y)] == 0 || mi_map.mini_map[math.floor(this_x)][math.floor(this_y)] == 3)
                            {
                            if (x != 0.0 || y !=  0.0){
                            let this_pont = new a_star_point(this_x, this_y , current_node , math.hypot((this_x - mi_player.x),(this_y - mi_player.y)), current_node.number_of_steps+1 , node_id_counter )
                            node_id_counter ++
                            these_posibilities.push(this_pont);
                                }
                            else{} 
                            }
                        else {} 
                        }
                }


        let allready_tried = []
        for (var i = 0; i < these_posibilities.length; i++) {
                        for (var j = 0; j < closed.length; j++)
                        {
                        if(closed[j].x == these_posibilities[i].x && closed[j].y == these_posibilities[i].y)
                            {
                            allready_tried.push(i)
                            }
                        }
        }

        allready_tried = allready_tried.reverse()
        for (var i = 0; i < allready_tried.length; i++) {
            these_posibilities.splice(allready_tried[i] , 1)
        }

        let allready_in_good_options = []
        for (var i = 0; i < these_posibilities.length; i++) {
                        for (var j = 0; j < good_options.length; j++)
                        {
                        if(good_options[j].x == these_posibilities[i].x && good_options[j].y == these_posibilities[i].y)
                            {
                            allready_in_good_options.push(i)
                            }
                        }
        }

        allready_in_good_options = allready_in_good_options.reverse()
        for (var i = 0; i < allready_in_good_options.length; i++) {
            these_posibilities.splice(allready_in_good_options[i] , 1)
        }


        for (var i = 0; i < these_posibilities.length; i++) {
            good_options.push(these_posibilities[i])
        }

        if ((math.abs(current_node.x - mi_player.x) < step_size)  &&  (math.abs(current_node.y - mi_player.y) < step_size))
        {
            found_player = 1
        }
        if (rounds_tried > 700)
        {
            found_player = 1
            current_node  = new a_star_point("fail" , "fail" , "start" , math.hypot((this.x - mi_player.x),(this.y - mi_player.y)), number_of_steps , 0)

        }
        }
    this.path = []
    console.log("end update path 1")
    if (found_player == 1)
        {
        console.log("end update path 2")
        this.path.push([mi_player.x , mi_player.y])
        while (current_node.parent != "start")
        {
            console.log("end update path 3")

            this.path.push([current_node.parent.x , current_node.parent.y])
            current_node = current_node.parent;
        }
        this.path.reverse()
        }
    }


    attack()
    {
    this.attack_counter += 1
    if (this.attack_counter > this.frames_per_attack_animation)
    {
        this.attack_counter = 0
        mi_player.health += (-this.damage_per_attack)
    }

    }


    act(){
    this.current_sprite.x = this.x
    this.current_sprite.y = this.y
    this.path_recalc_time  += 1;
    if (this.path_recalc_time > 50)
    {

        this.update_path_2();
        this.path_recalc_time = 0;
    }

    let current_attack_dist = math.pow(math.pow((this.x)-(mi_player.x), 2) + math.pow((this.y)-(mi_player.y),2) , 0.5)
    let current_walk_dist = math.pow(math.pow((this.x)-(this.path[0][0]), 2) + math.pow((this.y)-(this.path[0][1]),2) , 0.5)
    if (math.pow(math.pow((this.x)-(this.path[0][0]), 2) + math.pow((this.y)-(this.path[0][1]),2) , 0.5) < this.move_speed * 3)
    {

        this.path.splice(0,1);
        current_attack_dist = math.pow(math.pow((this.x)-(mi_player.x), 2) + math.pow((this.y)-(mi_player.y),2) , 0.5)
        current_walk_dist = math.pow(math.pow((this.x)-(this.path[0][0]), 2) + math.pow((this.y)-(this.path[0][1]),2) , 0.5)
    }

    if (current_attack_dist > this.min_attack_dist)
    {
        if (this.path.length > 1){
    let dx = this.path[0][0] - this.x
    let dy = this.path[0][1] - this.y
    let angle = math.atan2(dy,dx)
    angle *= 180
    whole_message += angle , "  angle   "

    if (angle == 0){angle = 0.00001}

    let sin_angle = math.sin(angle)
    let cos_angle = math.cos(angle)
    let frame_speed = this.move_speed * 1 //dt

    let speed_y = frame_speed * sin_angle
    let speed_x = frame_speed * cos_angle

    this.walk_animation_handler()
    this.x+=speed_x
    this.y+=speed_y
    }
    else
    {
        console.log("no path")
    }
    }
    else{
    this.attack()
        }

    }


    handle_idle()
    {
    if (this.idle_counter < this.idle_counter_limit)
        {
        this.idle_counter+= 1
        }
    else
    {
        this.idle_counter = 0
        random_idle_action_chooser()
    }
    }
    random_idle_action_chooser()
    {

    }
}

class tough_enemy extends enemy {
constructor(x , y , idle_sprite_image , walk_sprites) {
super(x , y , idle_sprite_image , walk_sprites);
this.health = 80;
}
show() {
return this.present() + ', it is a ' + this.model;
}
}

class item_spawner{

constructor(spawn_points ){
    this.spawn_points = spawn_points
    this.spawn_probability = 0.005
    this.min_spawn_dist = 4
}

spawn_checker(){
    var chooser = math.random()
    if (chooser < this.spawn_probability)
    {
    var chooser = math.random()
    var in_range = []
    for (var i = 0; i < this.spawn_points.length; i++) {
        var sp = this.spawn_points[i];
        if (math.pow(math.pow(sp[0]-mi_player.x, 2) + math.pow(sp[1]-mi_player.y, 2) , 0.5) > this.min_spawn_dist )
        {
        in_range.push(sp)
        }
        else{console.log(math.pow(math.pow(sp[0]-mi_player.x, 2) + math.pow(sp[1]-mi_player.y, 2) , 0.5)   , "   =  not > " , this.min_spawn_dist)}
    }
    var spawn_point_index = math.floor(chooser * in_range.length);
    var pickup_type = (Math.random()>0.5)? 1 : 0;
    var pickup_object1 = new pickup_object( pickup_type , in_range[spawn_point_index][0],in_range[spawn_point_index][1] , zombie_idle , zombie_walk_sprites)
    pickup_objects.push(pickup_object1)
    }
}
}

class spawner{

constructor(spawn_points ){
    this.spawn_points = spawn_points
    this.spawn_probability = 0.01
    this.tough_spawn_probability = 0.002
    this.min_spawn_dist = 4.
    }

spawn_checker(){
    var chooser = math.random()
    if (( chooser > this.tough_spawn_probability && chooser < this.spawn_probability) || enemies.length == 0)
    {
    var chooser = math.random()
    var in_range = []
    for (var i = 0; i < this.spawn_points.length; i++) {
        var sp = this.spawn_points[i]; if (math.pow(math.pow(sp[0]-mi_player.x, 2) + math.pow(sp[1]-mi_player.y, 2) , 0.5) > this.min_spawn_dist ) { in_range.push(sp) }
    }
    var spawn_point_index = math.floor(chooser * in_range.length);
    var enemy1 = new enemy( in_range[spawn_point_index][0],in_range[spawn_point_index][1] , zombie_idle , zombie_walk_sprites)
    enemies.push(enemy1)
    }


if (chooser < this.tough_spawn_probability || enemies.length == 0)
    {
    var chooser = math.random()
    var in_range = []
    for (var i = 0; i < this.spawn_points.length; i++) {
        var sp = this.spawn_points[i]; if (math.pow(math.pow(sp[0]-mi_player.x, 2) + math.pow(sp[1]-mi_player.y, 2) , 0.5) > this.min_spawn_dist ) { in_range.push(sp) }
    }
    var spawn_point_index = math.floor(chooser * in_range.length);
    var enemy1 = new tough_enemy( in_range[spawn_point_index][0],in_range[spawn_point_index][1] , tough_zombie_idle , tough_zombie_walk_sprites)
    enemies.push(enemy1)
    }
}
}


class raycast{
    constructor(){
        this.raycasting_results = []
        this.chunks_of_textures_to_render = []
    }

    get_chunks_of_textures_to_render(raycasting_results , dest_x, dest_y , w , h , x_co_ord_incase_its_a_door, y_co_ord_incase_its_a_door )
    {
        this.chunks_of_textures_to_render = []
        let dis_ray = raycasting_results
        let depth = dis_ray[0]
        let proj_height  = dis_ray[1]
        let texture  = dis_ray[2]
        let offset  = dis_ray[3]
        let ray  = dis_ray[4]
        let wall_collumn = bricks_texture
        if (texture == 1)
        {
            var wall_texture = bricks_texture
        }
        if (texture == 2){var wall_texture = door_images_list[0]}
        if (texture == 4 || texture == 5)
        {
            for (var i = 0; i < door_objects_list.length; i++) {
            if (door_objects_list[i].x == x_co_ord_incase_its_a_door && door_objects_list[i].y == y_co_ord_incase_its_a_door){ var wall_texture = door_objects_list[i].get_current_texture(); console.log("  door_objects_list[i].get_current_texture(); = " , door_objects_list[i].get_current_texture()); }
            }
        }
        if (proj_height < main_screen.height)
        {
            var clip_x = offset * (TEXTURE_SIZE - SCALE)
            var clip_y =  0
            var dx_clip = SCALE
            var dy_clip = TEXTURE_SIZE
            var placing_x = ray * SCALE
            var placing_y = (main_screen.height/2) - proj_height / 2
            var resize_width = SCALE
            var resize_height = proj_height;
        }
        else
        {
            var texture_height = TEXTURE_SIZE * main_screen.height / proj_height
            var clip_x = offset * (TEXTURE_SIZE - SCALE)
            var clip_y =  HALF_TEXTURE_SIZE - texture_height / 2
            var dx_clip = SCALE
            var dy_clip = texture_height
            var placing_x = ray * SCALE
            var placing_y = 0
            var resize_width = SCALE
            var resize_height = main_screen.height;
        }

        stuff_to_draw_this_frame.push( new a_thing_to_draw_this_frame(wall_texture, clip_x, clip_y ,dx_clip, dy_clip, placing_x, placing_y, resize_width, resize_height ,  depth , "wall texture" ))

    }

    ray_cast(){
        this.raycasting_results = []
        var player= mi_player
        var player_x = mi_player.x
        var player_y = mi_player.y
        mi_player.update_map_pos()
        var map_x = mi_player.map_pos[0]
        var map_y = mi_player.map_pos[1]
        var ray_angle = mi_player.angle - HALF_FOV
        let texture_hor = 0;
        let texture_vert = 0;
        var hor_wall_type = 0;
        var vert_wall_type = 0;
        var opening_tile_pos;

        console.log(mi_map.mini_map , " easter ")

        for (let ray = 0; ray < NUM_RAYS; ray++)
            {
                var opening_depth_vert = 99999
                var opening_x_vert = 0
                var opening_y_vert = 0
                var opening_texture_vert = 0
                var opening_depth_hor = 99999
                var opening_x_hor = 0
                var opening_y_hor = 0
                var opening_texture_hor = 0
                var opening_tile_pos_hor = "not set"
                var opening_tile_pos_vert = "not set"

                var sin_a = math.sin(ray_angle)
                var cos_a = math.cos(ray_angle)

                var opening_door_found = false;

                if (sin_a > 0){var y_hor = map_y + 1, dy = 1;}
                else {var y_hor= map_y - 1e-6; dy = -1;}
                var depth_hor = (y_hor - player_y) / sin_a
                var x_hor = player_x + depth_hor * cos_a
                var delta_depth = dy / sin_a
                var dx = delta_depth * cos_a
                var hit_a_wall = 0
                var wall_type = 0;
                screen_ctx.beginPath();
                for (let ray_bit = 0; ray_bit < MAX_DEPTH; ray_bit++)
                    {
                        var tile_hor = [math.floor(x_hor), math.floor(y_hor)]

                        var found = "nope"
                        for(let this_map_x = 0; this_map_x < mi_map.rows; this_map_x++){
                        for(let this_map_y = 0; this_map_y < mi_map.cols; this_map_y++){
                                    if (tile_hor[0] == this_map_x && tile_hor[1] == this_map_y)
                                                                            {
                                                                                found = "yep"
                                                                            }
                                                                        }
                                                                    }
                            if (found == "yep"){
                                if (mi_map.mini_map[tile_hor[0]][tile_hor[1]] == 4 || mi_map.mini_map[tile_hor[0]][tile_hor[1]] == 5)
                                {
                                opening_door_found = true;
                                opening_depth_hor = depth_hor
                                opening_x_hor = x_hor
                                opening_y_hor = y_hor
                                opening_texture_hor = mi_map.mini_map[tile_hor[0]][tile_hor[1]]
                                opening_tile_pos_hor = [tile_hor[0],tile_hor[1]]
                                
                                }
                                if (mi_map.mini_map[tile_hor[0]][tile_hor[1]] ==1 || mi_map.mini_map[tile_hor[0]][tile_hor[1]] ==2){
                                if (mi_map.mini_map[tile_hor[0]][tile_hor[1]] ==2){}
                                hor_wall_type = mi_map.mini_map[tile_hor[0]][tile_hor[1]]
                                texture_hor = mi_map.mini_map[tile_hor[0]][tile_hor[1]];

                                break                                              }
                                else {}
                                                }

                        x_hor += dx
                        y_hor += dy
                        depth_hor += delta_depth
                    }

                // verticals


                    if (cos_a > 0){var x_vert = map_x + 1; dx = 1;}
                    else {var x_vert= map_x - 1e-6; dx = -1;}

                    var  depth_vert = (x_vert - player_x) / cos_a
                    var  y_vert = player_y + depth_vert * sin_a

                    var  delta_depth = dx / cos_a
                    var  dy = delta_depth * sin_a

                        for (let ray_bit = 0; ray_bit < MAX_DEPTH; ray_bit++)
                            {

                                var tile_vert = [math.floor(x_vert), math.floor(y_vert)]
                                var found = "nope"
                                for(let this_map_x = 0; this_map_x < mi_map.rows; this_map_x++){
                                for(let this_map_y = 0; this_map_y < mi_map.cols; this_map_y++){
                                            if (tile_vert[0] == this_map_x && tile_vert[1] == this_map_y)
                                            {found = "yep";}
                                                                                }
                                                                            }
                                if (found == "yep"){
                                    if (mi_map.mini_map[tile_vert[0]][tile_vert[1]] == 4  || mi_map.mini_map[tile_vert[0]][tile_vert[1]] == 5)
                                    {
                                        opening_door_found = true;
                                        opening_depth_vert = depth_vert
                                        opening_x_vert = x_vert
                                        opening_y_vert = y_vert
                                        opening_texture_vert = mi_map.mini_map[tile_vert[0]][tile_vert[1]]
                                        opening_tile_pos_vert = [tile_vert[0],tile_vert[1]]   
                                    }
                                if (mi_map.mini_map[tile_vert[0]][tile_vert[1]] ==1 || mi_map.mini_map[tile_vert[0]][tile_vert[1]] ==2){
                                    if (mi_map.mini_map[tile_vert[0]][tile_vert[1]] ==2){}
                                    vert_wall_type = mi_map.mini_map[tile_vert[0]][tile_vert[1]]
                                    texture_vert = mi_map.mini_map[tile_vert[0]][tile_vert[1]];
                                    break                                           }
                                else {}
                                                }
                                x_vert += dx
                                y_vert += dy
                                depth_vert += delta_depth
                            }
                        if (opening_door_found) {
                        if (opening_depth_vert < opening_depth_hor){
                            var opening_wall_type = opening_texture_vert
                            var opening_depth = opening_depth_vert
                            var opening_texture = opening_texture_vert
                            opening_y_vert %= 1
                            opening_tile_pos = opening_tile_pos_vert
                            if (cos_a>0){var opening_offset = opening_y_vert; } 
                            else {var opening_offset = 1-opening_y_vert; } 
                                                        }
                        else{
                            var opening_wall_type = opening_texture_hor
                            var opening_depth = opening_depth_hor
                            var opening_texture = opening_texture_hor
                            opening_x_hor %= 1
                            opening_tile_pos = opening_tile_pos_hor
                            if (sin_a>0){var opening_offset =1-opening_x_hor; }
                            else {var opening_offset = opening_x_hor; }
                            }

                            console.log("opening_texture as set = " , opening_texture)

                        }


                        if (depth_vert < depth_hor){
                            wall_type = vert_wall_type
                            var depth = depth_vert
                            var texture = texture_vert
                            y_vert %= 1

                            if (cos_a>0){var offset = y_vert; } // console.log(offset.toString()+"  =   offset  =  y vert")}
                            else {var offset = 1-y_vert; } //console.log(offset.toString()+"  =   offset  = 1-y vert")}
                                                    }
                        else{
                            wall_type = hor_wall_type
                            var depth = depth_hor
                            var texture = texture_hor
                            x_hor %= 1

                            if (sin_a>0){var offset =1-x_hor; } 
                            else {var offset = x_hor; } 
                        }

                        // remove fishbowl effect
                        depth = depth * math.cos(mi_player.angle - ray_angle)

                        //projection
                        var proj_height = SCREEN_DIST / (depth + 0.0001)
                        var opening_proj_height = SCREEN_DIST / (opening_depth + 0.0001)

                        var x1 = mi_player.x* width_of_each_tile
                        var x2 = width_of_each_tile*mi_player.x +height_of_each_tile * depth * cos_a

                        screen_ctx.strokeStyle = "black";
                        if (wall_type == 1){
                        screen_ctx.rect(math.ceil(ray * SCALE), math.ceil((main_screen.height/2) - proj_height /2) ,math.ceil(SCALE), math.ceil(proj_height));
                        screen_ctx.stroke();
                        }
                        if (wall_type == 2){

                        screen_ctx.strokeStyle = "blue";
                        screen_ctx.rect(math.ceil(ray * SCALE), math.ceil((main_screen.height/2) - proj_height /2) ,math.ceil(SCALE), math.ceil(proj_height));
                        screen_ctx.stroke();
                    }

                    if (opening_door_found){
                        this.get_chunks_of_textures_to_render([opening_depth , opening_proj_height , opening_texture , opening_offset , ray] ,math.ceil(ray * SCALE), math.ceil((main_screen.height/2) - opening_proj_height /2) ,math.ceil(SCALE), math.ceil(opening_proj_height) , opening_tile_pos[0], opening_tile_pos[1] )
                                            }
                    this.get_chunks_of_textures_to_render([depth , proj_height , texture , offset , ray] , math.ceil(ray * SCALE), math.ceil((main_screen.height/2) - proj_height /2) ,math.ceil(SCALE), math.ceil(proj_height), "not neccesary" , "neccesary, is it neccesary to drink my own urine?")

                    radar_ctx.moveTo(player.x* width_of_each_tile , player.y* height_of_each_tile);
                    radar_ctx.lineTo(width_of_each_tile*player.x +width_of_each_tile * depth * cos_a , height_of_each_tile * player.y +height_of_each_tile * depth * sin_a);
                    radar_ctx.stroke();
                    ray_angle += DELTA_ANGLE
            }

    }

}

function handle_shooting()
{
    if (mi_player.selected_weapon == 0){var gun_shooting_frame_timer1 = 9; var gun_shooting_frame_timer2 = 20}
    else {if (mi_player.selected_weapon == 1){var gun_shooting_frame_timer1 = 2; var gun_shooting_frame_timer2 = 5}}
    gun_fire_counter += 1
    if (gun_fire_counter < gun_shooting_frame_timer1){current_gun_img = gun_images[mi_player.selected_weapon].shooting1}
    else if(gun_fire_counter > gun_shooting_frame_timer1 - 1 && gun_fire_counter < gun_shooting_frame_timer2 -1){current_gun_img = gun_images[mi_player.selected_weapon].shooting2}
    else {current_gun_img = gun_images[mi_player.selected_weapon].shooting1}
    if (gun_fire_counter > gun_shooting_frame_timer2){shooting = 0; current_gun_img = gun_images[mi_player.selected_weapon].standard; gun_fire_counter = 0; console.log("bang 4")}

}

function handle_timestamps()
{
    this_time_stamp = Date.now()
    dt = this_time_stamp - last_time_stamp
    last_time_stamp = Date.now()
}
function clear_screen(){
    screen_ctx.beginPath();
    screen_ctx.clearRect(0, 0, main_screen.width, main_screen.height);
    screen_ctx.fillStyle= "white";
    screen_ctx.fillRect(0, 0 , main_screen.width, main_screen.height);
    screen_ctx.stroke();
    screen_ctx.closePath();
}

var whole_message = "";
var the_frame_counter = 0
var behave;

function draw_crosshairs(){
    screen_ctx.beginPath();
    // horizontal crosshair
    screen_ctx.lineWidth = 2;
    screen_ctx.strokeStyle = "black";
    screen_ctx.moveTo((main_screen.width/2)-4, (main_screen.height/2));
    screen_ctx.lineTo((main_screen.width/2)+4, (main_screen.height/2));
    // vertical crosshair
    screen_ctx.moveTo((main_screen.width/2), (main_screen.height/2)-4);
    screen_ctx.lineTo((main_screen.width/2), (main_screen.height/2)+4);
    screen_ctx.stroke();
    screen_ctx.lineWidth = 1;
}


function game_loop(){
    update_hud()
    the_frame_counter+= 1
    var key_code_b = keycode_pressed
    mi_player.regularizer()
    if (the_frame_counter > 99155  || key_code_b == 112 || times_update_path_called > 98989)
    {
    clearInterval(behave);
    }
    if (mi_player.health < 1)
    {
    hud_health.innerHTML = " you dead :( "
    game_over_div.style.display = "block"
    clearInterval(behave);
    }
    else{
    }


    clear_screen();

    $(document).on("keypress", function (event) {
    a_key_pressed = 1
    keycode_pressed = parseInt(event.keyCode)
    })

    if (a_key_pressed==1){mi_player.move(event)}
    stuff_to_draw_this_frame = []
    for (var i = 0; i  < pickup_objects.length; i++) {
        pickup_objects[i].sprite.positioning();
        pickup_objects[i].do_stuff()
    }

    for (var enemy = 0; enemy < enemies.length; enemy++) {
        enemies[enemy].act()
        console.log(enemies[enemy])
        enemies[enemy].current_sprite.x = enemies[enemy].x
        enemies[enemy].current_sprite.y = enemies[enemy].y
        enemies[enemy].current_sprite.positioning();
    }
    mi_map.draw_mini_map();
    raycaster.ray_cast()
    if (shooting == 1)
    {
    handle_shooting()
    }
    door_objects_list.forEach((door) => {
    if (mi_map.mini_map[door.x][door.y] == 4 || mi_map.mini_map[door.x][door.y] == 3 || mi_map.mini_map[door.x][door.y] == 5)
    {
        door.currently_opening_or_closing_handler()
    }
    });

    a_key_pressed = 0
    keycode_pressed = "none";

    stuff_to_draw_this_frame_organized_by_dist = []

    for (var i = 0; i < stuff_to_draw_this_frame.length; i++) {
    stuff_to_draw_this_frame_organized_by_dist.push({"stuff":stuff_to_draw_this_frame[i]  , "dist":stuff_to_draw_this_frame[i].dist})
                                                            }

    stuff_to_draw_this_frame_organized_by_dist.sort(function(a,b) {return b.dist - a.dist});
    for (var i = 0; i < stuff_to_draw_this_frame_organized_by_dist.length; i++)
                        {
        if (stuff_to_draw_this_frame_organized_by_dist[i].stuff.placing_x == "nope"){screen_ctx.drawImage( stuff_to_draw_this_frame_organized_by_dist[i].stuff.image, stuff_to_draw_this_frame_organized_by_dist[i].stuff.clip_x, stuff_to_draw_this_frame_organized_by_dist[i].stuff.clip_y ,stuff_to_draw_this_frame_organized_by_dist[i].stuff.dx_clip, stuff_to_draw_this_frame_organized_by_dist[i].stuff.dy_clip)}
        else{
        screen_ctx.drawImage( stuff_to_draw_this_frame_organized_by_dist[i].stuff.image, stuff_to_draw_this_frame_organized_by_dist[i].stuff.clip_x, stuff_to_draw_this_frame_organized_by_dist[i].stuff.clip_y ,stuff_to_draw_this_frame_organized_by_dist[i].stuff.dx_clip, stuff_to_draw_this_frame_organized_by_dist[i].stuff.dy_clip, stuff_to_draw_this_frame_organized_by_dist[i].stuff.placing_x, stuff_to_draw_this_frame_organized_by_dist[i].stuff.placing_y, stuff_to_draw_this_frame_organized_by_dist[i].stuff.resize_width, stuff_to_draw_this_frame_organized_by_dist[i].stuff.resize_height );
            }
                        }
    the_spawner.spawn_checker()
    the_item_spawner.spawn_checker()

    screen_ctx.drawImage(current_gun_img, (main_screen.width / 2 - current_gun_img.width / 2)*1.05,  main_screen.height - current_gun_img.height);
    draw_crosshairs()

    if (out_of_ammo_bool == 1)
    {
    out_of_ammo_draw()
    out_of_ammo_bool = 0
    }

}

function reset(){
    game_over_div.style.display="none"
    enemies = []
    pickup_objects = []
    door_objects_list = []
    start_game()
    behave = setInterval(game_loop, 30);
                }

function start_game() {
    mi_map = new map(mini_map)
    console.log(mi_map.mini_map)
    mi_player = new player()
    console.log(mi_map.mini_map)
    raycaster = new raycast()
    console.log(mi_map.mini_map)
    mi_map.draw_mini_map();
    raycaster.ray_cast()
    console.log(mi_map.mini_map)
    console.log(" doo doo doo de de , de doo de de , de doo ")
    var this_time_stamp = Date.now()
    var last_time_stamp = Date.now()

    for (var x = 0; x < mi_map.mini_map.length; x++) 
    {
        for (var y = 0; y < mi_map.mini_map[x].length; y++) 
        {
            if (mi_map.mini_map[x][y]==2) 
            {
                door_objects_list.push(new door(x,y))
            }
        }
    }



    if (testing_bool){
        test_enemy = new enemy( 3.1,3.1 , zombie_idle , zombie_walk_sprites)
        test_enemy2 = new enemy( 3.2,3.2 , zombie_idle , zombie_walk_sprites)
        test_enemy3 = new enemy( 3.3,3.3 , zombie_idle , zombie_walk_sprites)
        test_enemy4 = new enemy( 3.4,3.4 , zombie_idle , zombie_walk_sprites)
        test_enemy5 = new enemy( 3.4,1.4 , zombie_idle , zombie_walk_sprites)
        test_enemy6 = new enemy( 3.5,1.5 , zombie_idle , zombie_walk_sprites)
        the_spawner = new spawner([[3.1,3.1],[3.2,3.2],[3.3,3.3],[3.4,3.4],[3.5,3.5],[3.6,3.6],[3.5,1.8] ,[1.4,1.3]  , [1.2, 3.4]])
        //    the_item_spawner = new item_spawner([1.5,1.5], [3.5,1.5], [3.5,2.5],[1.1,2.1],[1.4,2.1],[1.1,2.4],[1.1,3.9],[1.1,4.1],[1.1,5.9],[2.5,5.9],[3.5,5.9],[4.5,5.9],[5.9,5.9],[4.1,4.1],[7.1,4.1],[7.6,1.1])
        enemies.push(test_enemy)
        enemies.push(test_enemy2)
        enemies.push(test_enemy3)
        enemies.push(test_enemy4)
        pickup_objects.push( new pickup_object(1 , 1.5 , 3.5))
        pickup_objects.push( new pickup_object(1 , 1.4 , 3.5))
        pickup_objects.push( new pickup_object(1 , 1.5 , 3.4))
    }
    else{
    the_spawner = new spawner([[1.1,3.1],[1.2,2.2],[4.3,1.3],[3.4,5.4],[1.5,5.5],[5.6,3.6],[7.5,7.8], [5.5,5.5] , [4.8 , 4.8], [4.4 , 4.6]])
    the_item_spawner = new item_spawner([[1.5,1.5], [3.5,1.5], [3.5,2.5],[1.1,2.1],[1.4,2.1],[1.1,2.4],[1.1,3.9],[1.1,4.1],[1.1,5.9],[2.5,5.9],[3.5,5.9],[4.5,5.9],[5.9,5.9],[4.1,4.1],[7.1,4.1],[7.6,1.1]])
    test_enemy = new enemy( 7.5, 7.8 , zombie_idle , zombie_walk_sprites)
    enemies.push(test_enemy)
    }

    gun_images.push(new class_gun_images(pistol_img, shooting_1_pistol_img, shooting_2_pistol_img))
    gun_images.push(new class_gun_images(mg_img, shooting_1_mg_img, shooting_2_mg_img))
    behave = setInterval(game_loop, 30);
    if (behave) {
        hud_health.innerHTML = " you dead :( "
                }
}
