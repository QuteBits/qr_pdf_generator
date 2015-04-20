# QR codes PDF generator

[Javascript only] Encodes an array of strings into QR codes and generates a PDF out of it. Runs purely from the browser.

## How to use:

After you add jQuery and other 3 dependencies (watch example.html) just run

    stuff = ['time has come', 'bitch']; //your array of strings to encode
    qr_generate(stuff);                 //encodes the strings and generates the PDF with QR codes

![Alt text](https://raw.github.com/QuteBits/onScriptogram/master/img/10-01.jpg "QR to PDF Generator")

## Props:
To cray peeps who have written jQuery.js, FileSaver.js, jsPDF.js and qrcode.js
