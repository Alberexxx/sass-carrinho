//MobileMenu
/*
const header = document.querySelector("header");

window.addEventListener("scroll", function () {
  header.classList.toggle("sticky", this.window.scrollY > 0);
});

let menu = document.querySelector("#menu-icon");
let navmenu = document.querySelector(".navmenu");

menu.onclick = () => {
  menu.classList.toggle("bx-x");
  navmenu.classList.toggle("open");
};

//ScrollMenuBar
var prevScrollpos = window.pageYOffset;
window.onscroll = function () {
  var currentScrollPos = window.pageYOffset;
  if (prevScrollpos > currentScrollPos) {
    document.getElementById("navbar").style.top = "0";
  } else {
    document.getElementById("navbar").style.top = "-140px";
  }
  prevScrollpos = currentScrollPos;
};

//LightModel
const mode = document.getElementById("mode_icon");

mode.addEventListener("click", () => {
  const form = document.getElementById("icon");

  if (mode.classList.contains("bx-sun")) {
    mode.classList.remove("bx-sun");
    mode.classList.add("bx-moon");

    document.body.classList.add("dark");
    return;
  }

  mode.classList.remove("bx-moon");
  mode.classList.add("bx-sun");

  document.body.classList.remove("dark");
});

const optionMenu = document.querySelector(".select-menu"),
  selectBtn = optionMenu.querySelector(".select-btn"),
  options = optionMenu.querySelectorAll(".option"),
  sBtn_text = optionMenu.querySelector(".sBtn-text");
selectBtn.addEventListener("click", () =>
  optionMenu.classList.toggle("active")
);
options.forEach((option) => {
  option.addEventListener("click", () => {
    let selectedOption = option.querySelector(".option-text").innerText;
    sBtn_text.innerText = selectedOption;
    optionMenu.classList.remove("active");
  });
});
*/