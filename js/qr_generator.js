function qr_generate(codes, columns, scale, paper_width, paper_height, margin_left, margin_top){
    columns = columns || 9;
    scale = scale || 0.9;
    paper_width = paper_width || 210.0;
    paper_height = paper_height || 297.0;
    margin_left = margin_left || 10.0;
    margin_top = margin_top || 10.0;

    var doc = new jsPDF();

    //QR CODE GENERATOR - DO NOT CHANGE ANY PARAMETERS EXCEPT columns
    //--------------------------------------------------------------------------
    var ratio = 8.0/parseFloat(columns);
    var x_0 = 3.125*ratio, y_0 = 3.125*ratio, dx = 6.25*ratio, dy = 6.25*ratio; qr_width = 20.0*ratio;
    var code_margin_top = 5.15*ratio, code_margin_between = 1.0*ratio;
    var font_size_1 = 8.0*ratio, 
        font_size_2 = 8.0*ratio;    

    x_0*=scale;
    y_0*=scale;
    dx*=scale;
    dy*=scale;
    qr_width*=scale;
    code_margin_top*=scale;
    code_margin_between*=scale;
    font_size_1*=scale;
    font_size_2*=scale;

    x_0 += margin_left;
    y_0 += margin_top;

    var codes_per_page = columns*columns;
    var red_square_width_ratio = 0.13;

    options = {
        render      : "canvas",
        width       : qr_width,
        height      : qr_width,
        typeNumber  : -1,
        correctLevel    : QRErrorCorrectLevel.H,
                    background      : "#ffffff",
                    foreground      : "#000000"
    };

    var red_square_width = options.width*(red_square_width_ratio);

    for(var k = 0; k < codes.length; k++){
        var code_name = codes[k];

        if(k != 0 && k%codes_per_page == 0){
            doc.addPage();
        }

        if(k%codes_per_page == 0){
            for(var i = 0; i < columns+1; i++){
                doc.setDrawColor(200,200,200); // draw red lines
                doc.setLineWidth(0.2);
                doc.line(margin_left + scale*paper_width/columns*i, margin_top, margin_left + scale*paper_width/columns*i, margin_top + scale*paper_height); // vertical line
            }
            for(var i = 0; i < columns+1; i++){
                doc.setDrawColor(200,200,200); // draw red lines
                doc.setLineWidth(0.2);
                doc.line(margin_left, margin_top + scale*paper_height/columns*i, margin_left + scale*paper_width, margin_top + scale*paper_height/columns*i); // horizontal line
            }
        }

        var x   = x_0 + (k%columns)*(options.width+dx)
        var y_1 = y_0 + ((k%codes_per_page-k%columns)/columns)*(options.height+code_margin_top+code_margin_between+(parseFloat(font_size_1)+parseFloat(font_size_2))/17.0*4.0+dy)
    
        // create the qrcode itself
        var qrcode  = new QRCode(options.typeNumber, options.correctLevel);
        qrcode.addData(code_name);
        qrcode.make();

        // compute tileW/tileH based on options.width/options.height
        var tileW   = options.width  / qrcode.getModuleCount();
        var tileH   = options.height / qrcode.getModuleCount();

        // draw in the canvas
        var black_line = 0;
        doc.setDrawColor(0);
        doc.setFillColor(0,0,0);

        for( var row = 0; row < qrcode.getModuleCount(); row++ ){
            black_line = 0;
            for( var col = 0; col < qrcode.getModuleCount(); col++ ){
                //QR CODE (v3) using SQUARES OPTIMIZED
                if(qrcode.isDark(row, col)){
                    black_line = black_line+1;
                    if(col == qrcode.getModuleCount()-1){
                        doc.rect(x + tileW*(col-black_line+1), y_1 + tileH*row, tileW*black_line, tileH, 'F'); 
                    }
                } else {
                    if(black_line != 0){
                        doc.rect(x + tileW*(col-black_line), y_1 + tileH*row, tileW*black_line, tileH, 'F'); 
                        black_line = 0;
                    }
                }
            }   
        }

        var code_name_pre = code_name.substring(0,16);
        var code_name_post = code_name.substring(16,32);

        var y_text_line_1 = y_1 + options.height + parseFloat(font_size_1)/17.0*4.0 + code_margin_top;
        var y_text_line_2 = y_text_line_1 + parseFloat(font_size_2)/17.0*4.0 + code_margin_between;

        doc.setFontSize(font_size_1);
        doc.text(x, y_text_line_1, code_name_pre);
        doc.setFontSize(font_size_2);
        doc.text(x, y_text_line_2, code_name_post);
    }

    doc.output('save', 'qr_codes.pdf');
}