
// load product list at beginning

var baseURL = "http://localhost:9095";
var productListUrl = baseURL+"/productList";

var getReviewURL = baseURL+"/reviews"
var postReviews = baseURL + "/ratingsAndReviews";
PRODUCTS = {
    DEFAULT_PRODUCT_PAGE_SIZE :10,
    DEFAULT_REVIEW_PAGE_SIZE : 5,
    CURRENT_PRODUCT_OFFSET: 0,
    CURRENT_REVIEW_OFFSET: 0,
    ACTIVE_PRODUCT_INDEX: 0,
    PRODUCT_LIST: [],
    REVIEW_LIST :[]
}

CUSTOMER_RATING = "";

getProductList({offset:0, limit:5});

function getProductList(options){
var url = productListUrl+"?" ;
    if(options && options.offset){
        productListUrl = productListUrl+"offset="+ options.offset+ "&";
    }
    if(options && options.limit){
        productListUrl = productListUrl+"offset="+ options.limit+ "&";
    }

    $.ajax({url: url, success: function(result){
        PRODUCTS.PRODUCT_LIST = result;
        PRODUCTS.CURRENT_PRODUCT_OFFSET =options.offset +options.limit; 
        PRODUCTS.ACTIVE_PRODUCT_INDEX= 0;
        var activeProductId = result[PRODUCTS.ACTIVE_PRODUCT_INDEX];

        var reqOptions ={
            productId: activeProductId,
            limit : 20,
            offset: 0,
            sortBy :"helpfulness"
        }
        getReviews(activeProductId,reqOptions, null,populateProduct);
       // populateProductList(result, 0);
        //makeProductListVisible();
  }})
};

function getReviews(productId, options, offset, populateProduct){
    var reviewUrl = getReviewURL+"?";

    if(options && options.productId){
        reviewUrl = reviewUrl + "entityId=" +productId +" &";
    }
    if(options && options.limit){
        reviewUrl = reviewUrl + "limit= " +options.limit +" &";
    }
    if(options && options.offset){
        reviewUrl = reviewUrl + "offset="+options.offset +" &";
    }
    if(options && options.sortBy){
        reviewUrl = reviewUrl + "sortBy="+ options.sortBy;
    }

    $.ajax({url: reviewUrl, success: function(result){
        PRODUCTS.REVIEW_LIST = result;
        CURRENT_REVIEW_OFFSET = offset || 0
        populateProduct()
  }})

}

function getReviewList(productList){
    productList.foreach(function (productId){
        var options ={
            productId: productId,
            limit : 50,
            order: 0,
            sortBy :"helpfulness"
        }
        getReviews(product,options);

    })


}

function populateProduct(){


var activeProductId= PRODUCTS.PRODUCT_LIST [PRODUCTS.ACTIVE_PRODUCT_INDEX];
var ProductInfo = PRODUCTS.REVIEW_LIST;
var avgRating = ProductInfo.averageRating;
var totalRating = ProductInfo.totalNumberOfReviews;

populateProductinUI(activeProductId, avgRating,totalRating,PRODUCTS.REVIEW_LIST)
 
}


function populateProductinUI(productId, avgRating, totalRating, reviewList ){
    $(".product-Id").html(productId);
    
    $("#ratingSection").html(getStarHtml(avgRating));
    $("#totalRatings").html( totalRating);

    populateReviews(reviewList)

    makeProductListVisible();
}


function getStarHtml(avgRating){
    var html = `<label id="ratingValue" class="ratingValue">${avgRating}</label>`; 
    var fulStar = Math.floor(avgRating);

    var halfstar= avgRating- fulStar !=0;

    for(var i =0; i<fulStar; i++){
        html = html +  `<ion-icon name="star"></ion-icon>`
    }
    if(halfstar){
        html = html +  `<ion-icon name="star-half"></ion-icon>`
        halfstar= 1;
    }
    var remainingStar= 5 - (fulStar+halfstar);
    for(var j =0; j<remainingStar; j++){
        html = html +  `<ion-icon name="star-outline"></ion-icon>`
    }
    return html;
}

function makeProductListVisible(){

    $("#main-page").addClass("vis").removeClass("n-vis");
}




$("#submitButton").click( function(e){
    // get text data
    // get rating status
    e.stopPropagation();
    e.preventDefault();
var description = $("#reviewDescription").val();
var reviewTitle = $("#reviewTitle").val();

var activeProductId= PRODUCTS.PRODUCT_LIST [PRODUCTS.ACTIVE_PRODUCT_INDEX];

var data ={
    "author": "42",
    "entityId": activeProductId,
    "title": reviewTitle,
    "description": description,
    "rating": CUSTOMER_RATING
   }

/*$.post(postReviews, headers: { 'contentType': 'application/json' }, data,(resp,status,xhr)=>{
    console.log(resp);
} ,"json")*/
$.ajax({
    url: postReviews,
    type: 'post',
    data: JSON.stringify(data),
    headers: {
        'Content-Type': 'application/json'
    },
    dataType: 'json',
    success: function (data) {
        console.info(data);
    }
});
    alert( "review posted successfully" );
    $("#reviewDescription").val("");
    $("#reviewTitle").val("");
})



function populateReviews(reviewList){
    var rivews = reviewList.reviewList;

    var reviewSection = $("#review-section-dynamic");
    var html ="";
    rivews.forEach(rev=>{
        html = html + getReviewHTML(rev)
    })
    

    $(reviewSection).html(html);
}



function getReviewHTML(review){

    var title = review.title;
    var reviewRating = review.rating
    var reviewTime = ""
    var description = review.description;

    return ` <div class="card-comment"> <img class="img-circle img-sm" src="./images/user-image.png" alt="User Image">

    <div class="comment-text">
      <span class="username">
      ${title}
        <label>
          <small>Rated: </small> ${reviewRating} <ion-icon name="star"></ion-icon>
        </label>
        <span class="text-muted float-right">${reviewTime}</span>
      </span><!-- /.username -->
     ${description}
      <br>
      <span class="likeDislike">
        <button type="button" class="btn "><ion-icon name="heart-outline"></ion-icon></button>
        <button type="button" class="btn "><ion-icon name="heart-dislike-outline"></ion-icon></button>
      </span>
    </div> </div>`
}



$("#option1").click( function(e){
    e.stopPropagation();
    e.preventDefault();
    CUSTOMER_RATING = 1;
})
$("#option2").click( function(e){
    e.stopPropagation();
    e.preventDefault();
    CUSTOMER_RATING = 2;
})
$("#option3").click( function(e){
    e.stopPropagation();
    e.preventDefault();
    CUSTOMER_RATING = 3;
})
$("#option4").click( function(e){
    e.stopPropagation();
    e.preventDefault();
    CUSTOMER_RATING = 4;
})
$("#option5").click( function(e){
    e.stopPropagation();
    e.preventDefault();
    CUSTOMER_RATING = 5;
})






