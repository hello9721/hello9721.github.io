
const operator = ["+", "-", "*", "/"];                                      // 해당 문자가 연산자인지 아닌지 검사할 때 사용할 사칙 연산자 리스트
let check_idx = -1;                                                         // 연산자 검사에 사용할 연산자 인덱스를 담을 변수
let run = true;                                                             // run이 true 라면 입력창에, false라면 기록창에 값이 입력된다.
let c = "";                                                                 // 마지막으로 입력된 연산자
let n = "";                                                                 // 마지막으로 입력된 숫자

function check(a){                                                          // a가 사칙 연산자라면 operator 리스트에서 해당 연산자의 인덱스를
                                                                            // check_idx에 저장
    if (a == "+"){ check_idx = 0; } else if (a == "-") { check_idx = 1; } else if (a == "*") { check_idx = 2; } else if (a == "/") { check_idx = 3; }

}


function add(char){                                                         // 클릭된 숫자를 input 창에 입력해주는 함수
    
    record = document.getElementById("record");
    display = document.getElementById("display");
    result = document.getElementById("result");

    if (result.value != ""){                                                // 나중에 계산을 한번 하고 나서 새로운 숫자를 입력할 때 기록창과 결과창 초기화

        record.value = "";
        result.value = "";
        
        n = "";                                                             // 새로운 연산이 시작되므로 n과  c도 초기화
        c = "";

    }

    if ( record.value == "" ){ display.value += char; }                     // 기록창이 비어있다면 무조건 입력창에 숫자 입력
    else {
        if (run){ display.value += char; }                                  // 기록창에 값이 있다면 run의 상태에 따라 기록창 혹은 입력창에 숫자 입력
        else { record.value += char; }
    }

    n += char;                                                              // n은 초기화 되기 전까지 계속 누적된다.

}

function add_(char){                                                        // 클릭된 연산자를 input창에 입력해주는 함수

    record = document.getElementById("record");
    display = document.getElementById("display");
    result = document.getElementById("result");

    record.value = record.value + display.value + char;                     // 이 함수가 실행될때 기록창은 원래 있던 내용 + 입력창 내용 + 방금 들어온 연산자의 값을 갖고
    display.value = "";                                                     // 입력창은 초기화 된다.

    l_record = record.value.length;                                         // 기록창에 있는 값의 길이

    if (result.value != ""){                                                // 한번 계산하고 난 직후 연산자를 입력하면 기록창에는 직전 결과 + 연산자의 값을 갖는다.

        record.value = result.value + char;
        result.value = "";                                                  // 그리고 결과창 초기화.

    }

    run = true;                                                             // run을 true로 만들어 준다.

    check(record.value.charAt(l_record - 2));                               // 기록창 값의 길이를 이용하여 기록창 마지막 문자를 가지고 연산자 검사 (연산자가 중복으로 입력되지는 않았는지 검사)
    if ( check_idx in operator ){                                           // 만약 해당 문자가 연산자라서 check_idx에 값이 입력되었고 그것이 operator에 있다면

        alert("숫자를 입력해주세요!");                                        // 숫자를 입력해달라는 알림창이 뜨고
        record.value = record.value.substring(0, l_record - 1);             // 중복으로 입력된 연산자가 하나 지워진다.
        check_idx = -1;                                                     // 그리고 check_idx 초기화
    
    }

    c = char;                                                               // 마지막으로 c에 입력했던 연산자가 저장되고
    n = "";                                                                 // 보통 연산자 뒤에는 새로운 숫자가 입력되기에 n 은 초기화

}

function back(){                                                            // backspace와 같은 역할을 한다.

    record = document.getElementById("record");
    display = document.getElementById("display");
    result = document.getElementById("result");

    l_record = record.value.length;                                         // 기록창 값의 길이
    l_display = display.value.length;                                       // 입력창 값의 길이

    if (result.value != ""){ result.value = ""; }                           // 제일 먼저 결과창에 값이 있다면 결과창 초기화
    else if (display.value != ""){ display.value = display.value.substring(0, l_display - 1); }
                                                                            // 입력창에 값이 있다면 마지막 문자를 하나 지운다.
    else if (record.value != ""){                                           // 기록창에 값이 있다면 기록창의 마지막 문자를 하나 지운다.

        record.value = record.value.substring(0, l_record - 1);
        check(record.value.charAt(l_record - 2));                           // 만약 지우고 나서 기록창의 마지막 글자가 연산자가 되었다면
        if ( check_idx in operator){
            
            run = true;                                                     // run을 true로 두고 check_idx도 초기화
            check_idx = -1;

        }
        else { run = false; }                                               // 만약 숫자라면 run은 false

    }

}

last_result = ""                                                            // 마지막 결과를 저장

function reset() {

    if (document.getElementById("result").value == "") {                    // 결과창에 값이 없다면 나머지 두개의 창 초기화

        document.getElementById("record").value = "";
        document.getElementById("display").value = "";

    } else {

        last_result = document.getElementById("result").value               // 결과창에 값이 있다면 결과창의 값을 last_result에 저장한다음

        document.getElementById("result").value = "";                       // 모든 창의 값과 n, c의 값을 초기화
        document.getElementById("record").value = "";
        document.getElementById("display").value = "";
        
        n = "";
        c = "";

    }

}

function answer(){                                                          // = 을 입력하면 실행되는 함수

    record = document.getElementById("record");
    display = document.getElementById("display");
    result = document.getElementById("result");

    if (c != "" & n != "" & display.value == "") {                          // 만약 계산을 마치고 바로 다시 이 함수가 실행된다면
                                                                            // 마지막으로 입력된 연산자로 직전 결과와 n을 연산 하여 표시
        record.value = result.value + c + n;
        result.value = eval(record.value);

    } else if (record.value == "" & display.value != ""){                   // 입력창에만 값이 입력되어 있다면

        record.value = display.value;                                       // 기록창값을 입력창 값으로 바꾸고 run은 false
        display.value = "";
        run = false;

    }else if (record.value != ""){                                          // 기록창이 비어있지 않다면
        
        v = record.value + display.value;                                   // v 에 기록창 + 입력창 값 저장

        record.value = v;                                                   // 기록창 값을 v로 바꾸고

        l_record = record.value.length;

        check(record.value.charAt(l_record - 1));                           // 기록창의 마지막 문자가 연산자라면
        if ( check_idx in operator ){

            alert("숫자를 입력해주세요!");                                    // 알림을 띄우고 나서 check_idx 초기화
            check_idx = -1;
    
        } else {

            display.value = "";                                             // 연산자가 아니라면
            result.value = eval(v);                                         // 입력창을 비우고 결과창에는 연산 값

        }

    } else if (display.value == "" & record.value == "" & result.value == "" & last_result != ""){ record.value = last_result; }
                                                                            // 만약 모든 창이 비어있고 last_result에 값이 저장된 상태라면 기록창에 last_result 값 입력

}

