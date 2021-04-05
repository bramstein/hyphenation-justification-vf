# Line Breaking, Justification, and Variable Fonts

A look at line breaking and justification, and how variable fonts will improve justified text.

Demonstration of using variable fonts to improve justification, presented at Robothon Conference 2018.

## How to use

Bring your own variable font. :) The code references Gimlet Variable Font, but the font itself is not included for licensing reasons. In order to use your own variable font, update the references to Gimlet in `index.html`. You may also need to update the width axis calculations depending on the range of the `wdth` axis of your font. Currently it is set to `97 +/- 3%`, where `97` is the "default" width. If your font has a different range, update this value accordingly in the CSS and JavaScript code in `index.html`.
