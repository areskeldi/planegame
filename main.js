var scene = new Phaser.Game(400, 490);

var main = {
    preload: function() { 
        scene.load.image('plane', 'images-audios/ye.png');
        scene.load.image('cloud', 'images-audios/cloud.png');
        scene.load.image('asteroid', 'images-audios/asteroid.png');
        scene.load.image('asteroid2', 'images-audios/asteroid2.png');
        scene.load.image('satellite', 'images-audios/satellite.png');
        scene.load.image('star', 'images-audios/star.png');
        scene.load.audio('jump', 'images-audios/jump.mp3');
    },

    create: function() { 
        // This function is called after the preload function     
        // Here we set up the game, display sprites, etc.  
        scene.stage.backgroundColor = '#71c5cf';

        // Set the physics system
        scene.physics.startSystem(Phaser.Physics.ARCADE);

        // Display the bird at the position x=100 and y=245
        this.plane = scene.add.sprite(100, 245, 'plane');

        // Add physics to the bird
        // Needed for: movements, gravity, collisions, etc.
        scene.physics.arcade.enable(this.plane);

        // Add gravity to the bird to make it fall
        this.plane.body.gravity.y = 700;  

        // Call the 'jump' function when the spacekey is hit
        var spaceKey = scene.input.keyboard.addKey(
                        Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);
        
        this.clouds = scene.add.group(); 
        
        this.timer = scene.time.events.loop(1500, this.addclouds, this);
        
        this.score = 0;
        this.labelScore = scene.add.text(10, 10, "Your score: " + this.score, 
            { font: "15px Arial", fill: "#ffffff" });
        this.labelInstruction = scene.add.text(30, 30, "Press SPACEBAR to jump", 
            { font: "15px Arial", fill: "#ffffff" });
        this.labelInvitation = scene.add.text(30, 470, "@areskeldi",
            { font: "15px Arial", fill: "#ffffff" });
        this.plane.anchor.setTo(-0.2, 0.5); 
        this.sound = scene.add.audio('jump');
    },

    update: function() {
        // This function is called 60 times per second    
        // It contains the game's logic   
        if (this.plane.y < 0 || this.plane.y > 490)
            this.restart();
        
        scene.physics.arcade.overlap(
            this.plane, this.clouds, this.hitcloud, null, this);  
        
        if (this.plane.angle < 20)
            this.plane.angle += 1; 
    },
    jump: function() {
        // Add a vertical velocity to the bird
        if (this.plane.alive == false)
            return;  
        this.plane.body.velocity.y = -310;
        scene.add.tween(this.plane).to({angle: -19}, 400).start();
        this.sound.play(); 
    },
    restart: function() {
        // Start the 'main' state, which restarts the game
        scene.state.start('main');
    },
    addcloud: function(x, y) {
        var cloud = scene.add.sprite(x, y, 'cloud');
        if (this.score > 5 && this.score < 10)
            var cloud = scene.add.sprite(x, y, 'satellite')
        if (this.score >= 10 && this.score < 15)
            var cloud = scene.add.sprite(x, y, 'asteroid');
        if (this.score >= 15 && this.score < 25)
            var cloud = scene.add.sprite(x, y, 'asteroid2');
        if (this.score >= 25)
            var cloud = scene.add.sprite(x, y, 'asteroid2');
        
        this.clouds.add(cloud);

        scene.physics.arcade.enable(cloud);

        cloud.body.velocity.x = -200; 

        cloud.checkWorldBounds = true;
        cloud.outOfBoundsKill = true;
    },
    addclouds: function() {
        // Randomly pick a number between 1 and 5
        // This will be the hole position
        var hole = Math.floor(Math.random() * 5) + 1;

        for (var i = 0; i < 8; i++)
            if (i != hole && i != hole + 1) 
                this.addcloud(400, i * 60 + 10);   
        this.score += 1;
        this.labelScore.text = "Your score: " + this.score;
    },
    hitcloud: function() {

        // It means the bird is already falling off the screen
        if (this.plane.alive == false)
            return;

        this.plane.alive = false;

        scene.time.events.remove(this.timer);

        this.clouds.forEach(function(p){
            p.body.velocity.x = 0;
        }, this);
    }, 
};

// Add the 'mainState' and call it 'main'
scene.state.add('main', main); 

// Start the state to actually start the game
scene.state.start('main');
