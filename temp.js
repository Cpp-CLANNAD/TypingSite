
function flashText(ele)
{
    var nor = 'rgba(0, 0, 0, 1)', bl = 'rgba(0, 0, 0, 0.3)';
    if (ele.style.color != bl)
        ele.style.color = bl;
    else
        ele.style.color = nor;
    if (ele.classList.contains("now"))
        setTimeout(function(){flashText(ele)}, 400);
    else
        ele.style.color = "";
}

eles = document.getElementsByClassName("let");

for (var i=0; i<eles.length; ++i) {
    var ele = eles[i];
    ele.addEventListener("mouseover", function(e){
        if (!e.target.classList.contains("now")) {
            e.target.classList.add("now");
            setTimeout(function(){flashText(e.target);}, 400);
        }
    });
    ele.addEventListener("click", function(e){e.target.classList.remove("now");});
}

$("body").addEventListener("keydown", function(e){
    console.log(e.key.toLowerCase());
});
