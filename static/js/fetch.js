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
            url: '/api/featured',
            data: {category: categoryname},
            success: function(category) {
                if (category.product_categories) {
                    var grid = $('.grid-container');
                    grid.empty();
                    category.product_categories.forEach(function(category) {
                        grid.append(`
                            <div class="item">
                                <a href="${'./products/'+category.product.id}">
                                    <div class="image"><img src=${category.product.thumbnail} /></div>
                                    <p>${category.product.name}</p>
                                    <hr/>
                                    <p>$${category.product.price}</p>
                                    <button type="button">add to cart</button>
                                </a>
                            </div>
                        `);
                    });
                }
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
