// light 설정

const homeEl = document.querySelector(".home");
const introEl = document.querySelector(".intro");
const skillEl = document.querySelector(".skill");
const projectEl = document.querySelector(".project");

const lHomeEl = document.querySelector(".light .home");
const lIntroEl = document.querySelector(".light .intro");
const lSkillEl = document.querySelector(".light .skill");
const lProjectEl = document.querySelector(".light .project");

// hover 시 light

let temp = document.querySelector(".select");

homeEl.addEventListener("mouseover", function(){

    temp.classList.remove('select');
    lHomeEl.classList.add('select');

});

homeEl.addEventListener("mouseout", function(){

    lHomeEl.classList.remove('select');
    temp.classList.add('select');

});

introEl.addEventListener("mouseover", function(){
    
    temp.classList.remove('select');     
    lIntroEl.classList.add('select');  

});

introEl.addEventListener("mouseout", function(){  
    
    lIntroEl.classList.remove('select');  
    temp.classList.add('select');    

});

skillEl.addEventListener("mouseover", function(){

    temp.classList.remove('select');     
    lSkillEl.classList.add('select');   

});

skillEl.addEventListener("mouseout", function(){    
     
    lSkillEl.classList.remove('select');  
    temp.classList.add('select');   

});

projectEl.addEventListener("mouseover", function(){ 
    
    temp.classList.remove('select');     
    lProjectEl.classList.add('select');  

});

projectEl.addEventListener("mouseout", function(){
     
    lProjectEl.classList.remove('select'); 
    temp.classList.add('select');    

});


// menu hide/show

const inEl = document.querySelector("header .inner");

function hide() {
    inEl.classList.add("hide");
}
function show() {
    inEl.classList.remove("hide");
}