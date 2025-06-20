$(window).load(function(){
  var loader = document.getElementById('loader');
  setTimeout(function(){
    gsap.to(loader,1,{opacity:0,pointerEvents:'none'})
    gsap.to(loader,0,{display:'none',delay:1});
    gsap.from('.profile-pic',1.2,{height:'100vh',delay:.8})
    gsap.from('.navigation-bar',1,{delay:2,opacity:0,})
    gsap.from('.social-link',1,{delay:2,opacity:0,});
    gsap.from('.home-text',1,{delay:2,opacity:0,});
    gsap.from('.gallery-link-home',1,{delay:2,opacity:0,});
  },2000);
//animation on mousemove

$(function(){
  var $cursor = $('.cursor')
    function cursormover(e){
     
     gsap.to( $cursor, {
       x : e.clientX ,
       y : e.clientY,
       stagger:.002,
       opacity:.6
      })
    }
    function cursorhover(e){
     gsap.to( $cursor,{
      scale:1.3,
      opacity:1
     })
     
   }
   function cursor(e){
     gsap.to( $cursor, {
      scale:1,
      opacity:.6
     }) 
   }
   $(window).on('mousemove',cursormover);
   $('a').hover(cursorhover,cursor);
   $('.navigation').hover(cursorhover,cursor);
   $('.navigation-close').hover(cursorhover,cursor);
   $('.about-close').hover(cursorhover,cursor);
   $('.project-close').hover(cursorhover,cursor);
   $('.blogs-close').hover(cursorhover,cursor);
   $('.gallery-close').hover(cursorhover,cursor);
   $('.imgs').hover(cursorhover,cursor);
   
})

//slideshow on desktop

var images = document.querySelectorAll('.profile-pic');
var index = 0 ;

function slideshow(){
  index++;
  if(index > images.length-1){
    index = 0;
  images[images.length-1].classList.remove('active-img');
  }
  images[index].classList.add('active-img');
  if(index>0){
    images[index-1].classList.remove('active-img');
  }
}
setInterval(slideshow,5000);


//slideshow on mobile

var imgarray = Array.from(images);
var imgholder = document.querySelector('.main-home-pic')
var imagesrc =  imgarray.map(image => image.src);
index2=0;

function slideshowmobile(){
  index2++;
  if(index2 > images.length-1){
    index2 = 0;
  }
  gsap.to(imgholder, {
    duration: 0.5,
    opacity: 0,
    ease: "power1.inOut",
    onComplete: () => {
      imgholder.style.backgroundImage = `url('${imagesrc[index2]}')`;
      gsap.to(imgholder, {
        duration: 0.5,
        opacity: 1,
        ease: "power1.inOut"
      });
    }
  });
}
setInterval(slideshowmobile,5000);

//animation-on-scroll
$(function(){

  const content = document.getElementById("about-content");
  let currentPos = window.pageYOffset;

  const callDistort = function () {
      const newPos = window.pageYOffset;
      const diff = newPos - currentPos;
      const speed = diff * 0.2;

      content.style.transform = "skewY(" + speed + "deg)";
      currentPos = newPos;
      requestAnimationFrame(callDistort);
  };

  callDistort();
})
//cursor color
$(function(){
  function cursorcolor(){
    gsap.to('.cursor',1,{border:"1px solid rgb(235,235,235)"})
  }
  function cursorcolorblack(){
    gsap.to('.cursor',1,{border:"1px solid #101010"})
  }
  $('#navigation').hover(cursorcolor,cursorcolorblack);
  $('#gallery').hover(cursorcolor,cursorcolorblack);

//animations
  $('.navigation').on('click',function(){
    gsap.to('#navigation',.6,{y:0,delay:.3,})
    gsap.to('.navigation-links',.5,{opacity:1,delay:1.2,stagger:.1})
    gsap.to('.navigation-close',.5,{opacity:.8,delay:1.2})
    gsap.to('.logo',.5,{opacity:.8,delay:1.2})
    gsap.to('#home',.7,{delay:.3,y:"-40%"})
    gsap.to('.nav-li',.5,{opacity:1,delay:1.2,stagger:.1})
  })
  $('.navigation-close').on('click',function(){
    gsap.to('#navigation',.6,{y:"100%",delay:.3,})
    gsap.to('.navigation-links',.5,{opacity:0})
    gsap.to('.navigation-close',.5,{opacity:0})
    gsap.to('#home',.7,{delay:.3,y:"0%"})
    gsap.to('.logo',.5,{opacity:0})
    gsap.to('.nav-li',.5,{opacity:0,stagger:.1})
  })
  $('.home-link').on('click',function(){
    gsap.to('#navigation',.5,{y:"100%",delay:.5})
    gsap.to('.navigation-links',.5,{opacity:0})
    gsap.to('.navigation-close',.5,{opacity:0})
    gsap.to('#home',.7,{delay:.3,y:"0%"})
    gsap.to('.logo',.5,{opacity:0})
    gsap.to('.nav-li',.5,{opacity:0,stagger:.1})

  })
  $('.about-link').on('click',function(){
    gsap.to('#about',.2,{height:"100vh",overflow:"hidden"})
    gsap.to('#navigation',.5,{y:"100%",delay:.5})
    gsap.to('.navigation-links',.5,{opacity:0})
    gsap.to('.navigation-close',.5,{opacity:0})
    gsap.to('.logo',.5,{opacity:0})
    gsap.to('.nav-li',.5,{opacity:0,stagger:.1})
    gsap.to('#home',.5,{scale:.8,delay:1,overflow:"hidden"})
    gsap.to('#home',.7,{delay:.3,y:"0%"})
    gsap.to('#home',.5,{x:"-100%",delay:1.5,overflow:"hidden"})
    gsap.to('#about',0,{display:"block",delay:1})
    gsap.to('#about',0,{scale:.8,delay:.5})
    gsap.to('#about',.5,{x:0,delay:1.5})
    gsap.to('#about',.5,{scale:1,delay:2})
    gsap.to('#about',1,{height:"auto",delay:2.5})
    gsap.to('.about-opacity',.5,{opacity:1,stagger:.3,delay:2.5})
  })
  $('.gallery-link-home').on('click',function(){
    gsap.to('#galllery',.2,{height:"100vh",overflow:"hidden"})
    gsap.to('#home',.5,{scale:.8,delay:0})
    gsap.to('#home',.5,{x:"-100%",delay:.5})
    gsap.to('#gallery',0,{display:"block",delay:.5})
    gsap.to('#gallery',0,{scale:.8,delay:0})
    gsap.to('#home',.7,{delay:.3,y:"0%"})
    gsap.to('#gallery',.5,{x:0,delay:.5})
    gsap.to('#gallery',.5,{scale:1,delay:1})
    gsap.to('#gallery',1,{height:"auto",delay:1.5})
    gsap.to('.gallery-opacity',.5,{opacity:1,stagger:.3,delay:1.5})
  })
  $('.about-close').on('click',function(){
    gsap.to('#about',.5,{x:"100%",delay:.5})
    gsap.to('#about',0,{display:"none",delay:1})
    gsap.to('#about',.5,{scale:.8,delay:0})
    gsap.to('#about',.5,{scale:1,delay:1})
    gsap.to('#home',.5,{scale:.8,delay:0})
    gsap.to('#home',.5,{x:0,delay:.5})
    gsap.to('#home',.5,{scale:1,delay:1})
    gsap.to('.about-opacity',.5,{opacity:0,stagger:0,delay:.3})
    
  })
  $('.gallery-link').on('click',function(){
    gsap.to('#gallery',.2,{height:"100vh",overflow:"hidden"})
    gsap.to('#navigation',.5,{y:"100%",delay:.5})
    gsap.to('.navigation-links',.5,{opacity:0})
    gsap.to('.navigation-close',.5,{opacity:0})
    gsap.to('.logo',.5,{opacity:0})
    gsap.to('#home',.7,{delay:.3,y:"0%"})
    gsap.to('.nav-li',.5,{opacity:0,stagger:.1})
    gsap.to('#home',.5,{scale:.8,delay:1})
    gsap.to('#home',.5,{x:"-100%",delay:1.5})
    gsap.to('#gallery',0,{display:"block",delay:1})
    gsap.to('#gallery',0,{scale:.8,delay:.5})
    gsap.to('#gallery',.5,{x:0,delay:1.5})
    gsap.to('#gallery',.5,{scale:1,delay:2})
    gsap.to('#gallery',1,{height:"auto",delay:2.5})
    gsap.to('.gallery-opacity',.5,{opacity:1,stagger:.3,delay:2.5})
  })

  $('.gallery-close').on('click',function(){
    gsap.to('#gallery',.2,{height:"100vh",overflow:"hidden"})
    gsap.to('#gallery',0,{display:"none",delay:1})
    gsap.to('#gallery',.5,{scale:.8,delay:0})
    gsap.to('#gallery',.5,{x:"100%",delay:.5})
    gsap.to('#gallery',.5,{scale:1,delay:1})
    gsap.to('#home',.5,{scale:.8,delay:0})
    gsap.to('#home',.5,{x:0,delay:.5})
    gsap.to('#home',.5,{scale:1,delay:1})
    gsap.to('.gallery-opacity',.5,{opacity:0,stagger:0,delay:.3})

  })
})



  //CONTACT FORM (AFTER SUBMIT) 
    var submit = document.getElementById('submit');

    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    var mySwiper = new Swiper('.swiper-container', {
      direction: 'horizontal',
      loop: true,
      slidesPerView: 'auto',
      speed: 1000,
      spaceBetween: 70,
      centeredSlides: true,
      grabCursor: true,
      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.progress-bar-container-swiper',
        type: 'progressbar',
      },
      navigation: {
        nextEl: '#next',
        prevEl: '#prev',
      },
      mousewheel: true,
      observer: true,  
      observeParents: true,
    });

    function sendEmail() {
      var name = $("#name");
      var email = $('#email');
      var subject = $("#subject");
      var body = $("#body");
      
  
      

      if (isNotEmpty(name) && isNotEmpty(email) && isNotEmpty(subject) && isNotEmpty(body) ) {
          if($("#email").val().match(mailformat)){
            $('#submit').text("Sending");
            $.ajax({
                url: 'mail.php',
                method: 'POST',
                dataType: 'json',
                data: {
                    name: name.val(),
                    email: email.val(),
                    subject: subject.val(),
                    body: body.val()
                    
                }, success: function (response) {
                     $('form')[0].reset();
                     $('#submit').text("Sent!!!");
                }
                
             });
          }
          else{
            $('#message').css('opacity', '.8');
            setTimeout(function(){
            $('#message').css('opacity', '0');
            },2000)
        }

      }
  }
  
  function isNotEmpty(caller) {
      if (caller.val() == "" ) {
          caller.css('border', '1px solid red');
      $('#submit').text("Send");
          return false;
      }

       else
          caller.css('border', '');
      return true;
  }
  
  submit.addEventListener('click',sendEmail)
  
  





// GALLERY PAGE SLIDER


// SLIDER ON GALLERY PAGE





})