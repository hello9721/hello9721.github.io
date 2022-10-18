
// SCROLL EVENT

const descEl = document.querySelector(".desc");
const meEl = document.querySelector(".desc__me");
const classEl = document.querySelector(".desc__class");

let cnt = 0;

descEl.addEventListener("scroll", function () {

    Pos = descEl.scrollTop;
    cnt += 1;

    if (cnt >= 25 & Pos >= 1) {

        if (meEl.className.indexOf("up") == -1) {

            classEl.classList.remove("down");
            meEl.classList.add("up");

            cnt = 0;

        } else {

            classEl.classList.add("down");
            meEl.classList.remove("up");

            cnt = 0;

        }
    }

    console.log(cnt)
    descEl.scrollTo(0, 0);

})
