$(function(){


  // console.log(user.authenticated)
  $('#addImageForm').submit(function(event){
    event.preventDefault();
    var data = $(this).serialize();

    // console.log(data);
    // 'test' can be replaced with $(this).attr('action')
    $.post('/gallery', data)
      .then(function(serverRes){
        // on success render HTML
        addImageToGallery(serverRes);
      })
      .fail(function(err){
        // handle error
        alert("error")
      });
  });


  $('.editImageInGalleryForm').submit(function(event){
    event.preventDefault();
    var imageId = $(this).find('input[name="id"]').val();
    console.log('id',imageId)
    var data= $(this).serialize();
    // console.log('event: ',event)
    // console.log('data from edit:',data.id)

    $.ajax({
      url: '/gallery/'+imageId,
      type: 'PUT',
      data: data,
      success: function(response){
        updateGalleryImage(response)
      }
    })

  });

  $('.deleteInGalleryForm').submit(function(event){
    event.preventDefault();
    var imageId = $(this).find('input[name="id"]').val();
    console.log('id',imageId);
    var data= $(this).serialize();
    $.ajax({
      url: '/gallery/'+imageId,
      type: 'DELETE',
      data: data,
      success: function(response){
        console.log('sucess')
        if(response.showLogInModal){
          $('#loginModalButton').click();
        }else{
          console.log('removing image')
          removeGalleryImage(response);
        }

      }
    })

  });

  // if($('#loggedIn').text()){
  //   $('.onlyForLogged').show();
  // } else{
  //   $('.onlyForLogged').hide();
  // }


});


function addImageToGallery(imgData){
  // console.log('imageData: ',imgData);
  var wrapperDiv = $('<div>',{class:'small-12 medium-4 large-4 columns containerDiv'})//try adding a div with many classes
  var newImageLink = $('<a>',{href: '/gallery/'+imgData.singlePic.id});
  var galleryImageDiv = $('<div>',{class: 'galleryImage'});
  var singleImageTag = $('<img>',{src: imgData.singlePic.link, class: 'singleImage'})
  var labelContainer = $('<div>');
  var label = $('<span>',{class: 'label'}).html(imgData.singlePic.author);
  var description = $('<p>').html(imgData.singlePic.description);

  galleryImageDiv.append(singleImageTag);
  newImageLink.append(galleryImageDiv);
  labelContainer.append(label).append(description);
  wrapperDiv.append(newImageLink).append(label);
  $('.row.gallery').prepend(wrapperDiv);
  $('a.close-reveal-modal').trigger('click');
};

function updateGalleryImage(imgData){
  var imageDiv = $('#galleryImage'+imgData.id);
  imageDiv.find('.singleImage').attr('src',imgData.link);
  imageDiv.find('.author').text(imgData.author);
  imageDiv.find('.description').text(imgData.description);

  var singleimageDiv = $('#singleImage'+imgData.id);
  // singleimageDiv.find('.singleImage').attr('src',imgData.link);
  // singleimageDiv.find('.author').text(imgData.author);
  // singleimageDiv.find('.description').text(imgData.description);
  // **************** working on this right now

  $('a.close-reveal-modal').trigger('click');
};

function removeGalleryImage(imgData){
  $('#galleryImage'+imgData.id).remove();
};
