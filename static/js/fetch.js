$(document).ready(function() {
    var target = $(".grid-menu ul li a.active").data('target');
    var data;
        
    fetch(target);

    $('.grid-menu ul li a').on('click', function(e) {
        if (!$(this).hasClass('active')) {
            document.querySelector('.grid-menu ul li a.active').className = '';
            e.target.className = "active";
            fetch(e.target.dataset.target);
        }
    });

    function fetch(categoryname) {
        $.ajax({
            url: './api/featured',
            data: {category: categoryname},
            success: function(category) {
                var product = category.product_categories;
                var grid = $(".grid-container");
                grid.empty();
                product.forEach(function(product) {
                        grid.append(`
                        <div class="item">
                            <a href="#">
                                <div class="image"></div>
                                <p>${product.product.name}</p>
                                <hr/>
                                <p>$${product.product.price}</p>
                                <button type="button">add to cart</button>
                            </a>
                        </div>
                    `);
                });
            }
        });  
    }
});

$('button#shop-now').click(function(e) {
    e.preventDefault();
    var targetid = '#' + this.dataset.target;
    var target = $('div' + targetid);
    $('html, body').animate({
        scrollTop: target.offset().top
    }, 500);
});
