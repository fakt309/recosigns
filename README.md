# Recosigns

**Demo: https://gaidadei.ru/recosigns/demo/**  
**Documentation: https://gaidadei.ru/recosigns/**  
**Download: https://gaidadei.ru/recosigns/recosigns.zip**  
  
buy premium: https://gaidadei.ru/premium *(Absolutely no different from the free version, but you have the right to change the file name to "recosigns.premium.js")*  
  
This JavaScript library is developed to recognize signs entered on the display of a smartphone for websites. You can create signs and process calling them.  
  
![js library recognise signs smartphone web](https://user-images.githubusercontent.com/43887554/126714472-0a5b5291-aa26-4c81-a8b3-96605f9435dd.gif)

## Quick start

     <script src="https://gaidadei.ru/recosigns/recosigns.js"></script>
     <script>
       var touch = new Recognize(["template1.png", "template2.png"], window, function(n) {
         alert("You entered sign number "+n);
       });
     </script>

That's all!!! Your screen will now recognize signs. Let's take a closer look at what we have entered into our object *Recognize*. For the first argument, we added an array with links to signs templates that we'll talk about below. The second argument is the DOM object that you will touch with your finger. The third argument is the function that is executed after any sign has been recognized. The index of this sign is passed to the function, according to the array added in the first argument.

## Templates

![js library recognise signs smartphone web](https://user-images.githubusercontent.com/43887554/126716190-364ab335-f33b-4b75-bd6b-a3cc901ba367.png)
![js library recognise signs smartphone web](https://user-images.githubusercontent.com/43887554/126716212-13837757-fe30-40d5-809b-92c3235b2b7f.png)
![js library recognise signs smartphone web](https://user-images.githubusercontent.com/43887554/126716216-e2919b8d-a25c-44cd-a1c4-c31a31072397.png)

Templates are just png format pictures that indicate the signs to be recognized. Image size doesn't matter. A larger image, more accurate recognition, but this does not big affect. Considering the accuracy and weight of the picture, I think the optimal size is 500x500 pixels. The image should be covered with a white background. The red circle specify the beginning, the blue - end, these points should be on top of everything else. Red must be strictly red (#ff0000, rgb(255, 0, 0)). Blue must be strictly blue (#0000ff, rgb(0, 0, 255)). The black line indicates the sign that we want to read.
