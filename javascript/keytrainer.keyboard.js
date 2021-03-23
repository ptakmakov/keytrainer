function Div(o){
    return $("<div/>", o);
}
function KeysRow(){
    return {
        class: "keys-row"
    }
}
function Delimiter(){
    return {
        class: "keys-delemiter"
    }
}
function Key(key){
    if(!Array.isArray(key)&&key.length!=3) return null;
    var keyElement = null;
    var isSpecial = key[1].length > 1;
    var isBackSlash = key[1] == "\\";
    var keyPrimary = key[1];
    var keySecondary = key[2];
    var keyFinger = key[0];
    var style = (isSpecial || isBackSlash)? keyPrimary.replace("\\", "Backslash") : "key";
    style+=" "+keyFinger;
    return{
        class: style,
        primary: keyPrimary,
        secondary: keySecondary,
        isSpecial: isSpecial,
        isBackSlash: isBackSlash
    }
}
function KeyRow(){
    return{
        class: "key-row"
    }
}
function KeyCell(){
    return{
        class: "key-cell"
    }
}
function KeySpecial(){
    return{
        class: "key-special"
    }
}
function Keyboard() {
    return{
        keys: [],
        Init: function(src){
            var self = this;
            self.keyboardElement = $(".keyboard").html("");
            $.getJSON(src, function (data) { self.layout = data; document.dispatchEvent(loadLayout); })
        },
        Render: function(){
            var Rows = this.layout;
            for (var r = 0; r < Rows.length; r++) {
                var row = new Div(new KeysRow()).appendTo(this.keyboardElement);
                if (r < Rows.length - 1)
                    new Div(new Delimiter()).appendTo(this.keyboardElement);
                this.RenderRow(Rows[r], row);
            }
            document.dispatchEvent(renderKeyboard);
        },
        RenderRow: function (keys, row) {
            for (var k = 0; k < keys.length; k++) {
                var key = new Key(keys[k]);
                if (key) {
                    this.RenderKey(new Div().addClass(key.class).appendTo(row), key);
                }
            }
        },
        RenderKey: function (key, o) {
            o.keyElement = key;
            this.keys.push(o);
            var row;
            if (o.isSpecial) {
                row = new Div(new KeyRow()).appendTo(key);
                new Div(new KeySpecial()).text(o.secondary).appendTo(row);
            }
            else {
                row = new Div(new KeyRow()).appendTo(key);
                new Div(new KeyCell()).text(o.secondary).appendTo(row);
                new Div(new KeyCell()).appendTo(row);
                row = new Div(new KeyRow()).appendTo(key);
                new Div(new KeyCell()).appendTo(row);
                new Div(new KeyCell()).text(o.primary).appendTo(row);
            }
        }
    }
}