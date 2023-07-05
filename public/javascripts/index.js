
(function(){


var _o = {
    name: "0元1G国内流量日包",
    itemId: "40201121",
    hdId: "GDXY-FWPJ",
}
var _u = {
    tel: "",
    bill: "",
    code: ""
}

function countDown(s){
    if(s-- > 0){        
        $("#sendSms").attr(`disabled`, "disabled")                
        $("#sendSms").html(`${s}秒后重试`)
        setTimeout(()=>{countDown(s)}, 1e3)
    }else{
        $("#sendSms").html(`获取验证码`)
        $("#sendSms").removeAttr(`disabled`)
    }    
}

function checkNumber(nb){
    if(nb && nb.match(/^1[3-9]\d{9}$/)){        
        $("#sendSms").removeAttr("disabled")  
        $("#cellNumber").val(nb)         
    }else{
        $("#sendSms").attr("disabled","disabled")
    }   
}

function showResult(msg){
    $("#resultDisplay").val("")
    setTimeout(()=>{
        $("#resultDisplay").val(msg)
    },500)  
}


$('#product input:radio').change(()=>{
    let val = $('#product input:radio:checked').val() || "1"
    if(val == "1"){
        _o = {
            name: "0元1G国内流量日包",
            itemId: "40201121",
            hdId: "GDXY-FWPJ",
        }       
    }else{
        _o = {
            itemId: "40201056",
            hdId: "GDBJZF_CZCJ",
            name: "5G网络专用体验流量月包30GB"
        }        
    }
    console.log("选择 %s", _o.name)

})


$("#cellNumber").keyup(()=>{    
    checkNumber($("#cellNumber").val())
})

$("#sendSms").click(function(){   
    _u.number = $("#cellNumber").val()
    localStorage.setItem("gdct_tel", _u.number)     
    let payload = {
        "d.d01": _u.number,
        "d.d02": "3",
        "d.d03": "ECSS_BL_001",
        "d.d04": "WEB",
        "d.d06": "1",
        "d.d07": _o.itemId //itemId
    }
    // J10138 lantId
    $.post("/api/J/J20096.j", payload, (body)=>{
        countDown(6)   
        if (body.b && body.b.c == '00') {
            if (body.r && body.r.code == '000') {
                console.log('验证码发送成功！');
                _u.bill = body.r.r01
                
            } else {
                console.log('验证码发送失败！');
            }
        } else {
            console.log('发送请求失败！');
        } 
        showResult(body.r && body.r.msg || body.b.c )
    })
})

$("#smsCode").keyup(()=>{
    let code = $("#smsCode").val()
    if(code.match(/^\d{6}$/)){
        $("#submitOrder").removeAttr("disabled")        
    }else{
        $("#submitOrder").attr("disabled","disabled")
    }
})



$("#submitOrder").click(function(){
    _u.code = $("#smsCode").val()
    let payload = {
        "d.d01": _u.number,
        "d.d02": _o.itemId,
        "d.d03": _o.hdId,
        "d.d04": "OTHER",
        "d.d05": _u.code,
        "d.d06": _u.bill, //bill
        "d.d07": "0", //支付方式
        "d.d08": "",
        "d.d10": "",
        "d.d12": "NEWTOUCH",
    }    
    $.post("/api/J/J20031.j", payload, (body)=>{
        console.log("办理结果, %s, %s", body.r.code, body.r.msg) 
        showResult(body.r && body.r.msg || body.b.c )
    })
})


checkNumber(localStorage.getItem("gdct_tel"))

})()