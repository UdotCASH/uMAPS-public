var coll = document.getElementsByClassName("collapsible");


function initialize(){
for (let i = 0; i < coll.length; i++) {
  console.log(i)
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}
}
