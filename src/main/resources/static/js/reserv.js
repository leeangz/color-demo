var locale = "ko";

var minStartDT;
var maxEndDT;

$(document).ready(function () {
  $(window).off("resize");

  // 헤더 메뉴 활성화 (개인예매)
  $("#li_10").addClass("on");

  getExhibitInfoList();

  var sYearMonth = dateUtil.getToday("").substring(0, 6);
  var twoWeekDay = getCurrentMonth();
  if (sYearMonth < twoWeekDay) {
    sYearMonth = twoWeekDay;
  }
  $("#calendar_date").val(sYearMonth);
  getCalendarView(sYearMonth);

  $("#step0 .tit").on("click", function () {
    titleClickOpenEvent($(this));
  });

  $(".clickPeople").delegate(
    'input[type="radio"] + label',
    "click",
    function (e) {
      return clickPeopleCheck($(this));
    }
  );

  $(".clickPeople").delegate(
    'input[type="radio"]',
    "change",
    updateTotalPriceView
  );

  $(".clickDay, .clickTime").delegate("a", "click", function (e) {
    var $this = $(this);
    var i;
    if ($this.parents(".clickDay").length > 0) i = 0;
    if ($this.parents(".clickTime").length > 0) i = 1;

    var $thisDis;
    switch (i) {
      /* 날짜 선택 */
      case 0:
        e.preventDefault();
        $thisDis = $this.parent("td").hasClass("select_day");
        if ($thisDis) {
          WG_StartWebGate(
            1740, // GATE-ID
            function () {
              updateClickDayView($this);
            },
            "FRONTEND", // fixed
            "서비스 접속대기 중(Please wait.)", // 대기UI 제목
            false, // fixed
            function () {
              // 유량제어 서비스 장애 시 처리
              updateClickDayView($this);
            }
          );
        }
        return false;
        break;
      /* 시간 선택 */
      case 1:
        e.preventDefault();
        $thisDis =
          $this.parent("li").hasClass("sold_out") ||
          $this.parent("li").hasClass("unselect");
        if (!$thisDis) {
          updateClickTimeView($this);
        } else {
          return false;
        }
        break;
    }
  });
});

function nextOpen(i) {
  var mobileH = 0;
  var mochk = false;
  if ($("#wrap").hasClass("mobileJS")) {
    mobileH = $(".float_cont.mo").outerHeight();
    mochk = true;
  }
  $("#step" + (i + 1))
    .addClass("open")
    .find(".accordion_cont")
    .slideDown(400);

  if (i == 2) {
    $(".lowerBtn").addClass("open");
    if (mochk) {
      $(".footer").css({
        "padding-bottom":
          $(".lowerBtn").find(".total_wrap").outerHeight() +
          $(".lowerBtn").find(".lower_btn").outerHeight(),
      });
    }
  } else {
    var scrlAfter = $("#step" + (i + 1)).offset().top;
    $("html, body")
      .stop()
      .animate({ scrollTop: +(scrlAfter - mobileH) }, 400, function () {
        // window.location.assign('#step'.concat(i + 1, '-head'));
        document.querySelector("#step".concat(i + 1, "-head")).focus();
      });
  }
  return false;
}

function titleClickOpenEvent($this) {
  var hasClass = $this.parent("li").hasClass("open");

  if (hasClass) {
    $this.parent("li").removeClass("open").find(".accordion_cont").slideUp(400);
  } else {
    $this.parent("li").addClass("open").find(".accordion_cont").slideDown(400);
  }
}

// 선택된 전시 데이터
function getExhibitInfoList() {
  $.ajax({
    url: "https://ticket.leeum.org/leeum/personal/getExhibitInfoListJson.do",
    type: "POST",
    contentType: "application/x-www-form-urlencoded; charset=utf-8",
    data: {
      foundCd: "M30",
      locCd: "3",
      muzCd: "110110",
      eventCd: "202104|202202|202301",
      selectGbn: "202202",
    },
    dataType: "json",
    async: false,
    cache: false,
    success: function (data) {
      var exhibitInfoList = data.exhibitInfoList;
      var exhibitInfoDate = data.exhibitInfoDate;

      var exhibitName = stringUtil.replaceAll(
        stringUtil.replaceAll(exhibitInfoList[0].EXHIBIT_NAME, "&lt;", "<"),
        "&gt;",
        ">"
      );
      var today_year = dateUtil.getToday("").substring(0, 4);
      if (today_year == "2022") {
        if (exhibitInfoList.length == 2) {
          $("#floatMO_exhibit").text(exhibitName);
          $("#floatMO_more").hide();
        } else {
          $("#floatMO_exhibit").text(
            exhibitName + " 외 " + (exhibitInfoList.length - 2)
          );
        }
      } else {
        if (exhibitInfoList.length == 1) {
          $("#floatMO_exhibit").text(exhibitName);
          $("#floatMO_more").hide();
        } else {
          $("#floatMO_exhibit").text(
            exhibitName + " 외 " + (exhibitInfoList.length - 1)
          );
        }
      }

      var eventNm = "";
      var layerHtml = "";
      var swiperHtml = "";
      var nowDt = dateUtil.getToday("").substring(0, 8);

      /*minStartDT = exhibitInfoList[0].EXHIBIT_START_DT;
				maxEndDT = exhibitInfoList[0].EXHIBIT_END_DT;*/

      minStartDT = exhibitInfoDate.FROM_DT + "";
      maxEndDT = exhibitInfoDate.TO_DT + "";

      var onlyOngoing = true;
      $.each(exhibitInfoList, function (i, item) {
        //예정 상설전이 있을때는 예정 상설전이 표현되지 않도록 하기 위해 if문 추가함
        if (
          item.PLACE_GRP_10 == 2 ||
          (item.PLACE_GRP_10 == 1 && item.PLACE_GRP_20 == 1)
        ) {
          var itemExhibitName = stringUtil.replaceAll(
            stringUtil.replaceAll(item.EXHIBIT_NAME, "&lt;", "<"),
            "&gt;",
            ">"
          );

          swiperHtml +=
            '<div class="swiper-slide"><img src="/getImage.do?fileGroupId=' +
            item.FILE_GROUP_ID +
            '" alt=""></div>';
          layerHtml += "<li>" + itemExhibitName + "</li>";

          eventNm += (eventNm != "" ? "|" : "") + itemExhibitName;

          if (item.PLACE_GRP_10 == 1 && item.PLACE_GRP_20 == 1)
            onlyOngoing = false;
        }

        if (item.PLACE_GRP_10 == 1 && item.PLACE_GRP_20 == 2 && onlyOngoing) {
          var itemExhibitName = stringUtil.replaceAll(
            stringUtil.replaceAll(item.EXHIBIT_NAME, "&lt;", "<"),
            "&gt;",
            ">"
          );
          swiperHtml +=
            '<div class="swiper-slide"><img src="/getImage.do?fileGroupId=' +
            item.FILE_GROUP_ID +
            '" alt=""></div>';
          layerHtml += "<li>" + itemExhibitName + "</li>";
          eventNm += (eventNm != "" ? "|" : "") + itemExhibitName;
        }
      });

      // 현재날짜보다 이전 데이터는 보여주지 않음
      if (nowDt > minStartDT) {
        minStartDT = nowDt;
      }

      $("#eventNm").val(eventNm);

      $("#floatPC_swiper, #floatMO_swiper").html(swiperHtml);
      $("#floatPC_layer, #floatMO_layer").html(layerHtml);
      $("#floatPC_possible, #floatMO_possible").html(
        "장소 - " + exhibitInfoList[0].PLACE
      );
      /*$("#floatPC_possible, #floatMO_possible").html("장소 - " + getPlaceNM(exhibitInfoList[0].PLACE));*/
      $("#shopCd").val(exhibitInfoList[0].SHOP_CD);

      swiperComm();

      setCalendarSelectView(exhibitInfoList);
    },
  });
}

function getPlaceNM(placecode) {
  /*var placeList = placecode.split(',');
        var returnStr = "";

        for(var i in placeList){
            var curPlace = placeList[i].replace(' ','');

            if(curPlace=='M3'){
                returnStr += "아동교육문화센터";
            }else{
                returnStr += curPlace.replace(' ','');
            }
            if(i!=placeList.length-1){
                returnStr += ', ';
            }
        }*/
  return returnStr;
}
// 달력 select 표시 설정
function setCalendarSelectView(exhibitInfoList) {
  var nowDateStr = dateUtil.getToday("").substring(0, 6);
  var twoWeekDay = getCurrentMonth();
  if (nowDateStr < twoWeekDay) {
    nowDateStr = twoWeekDay;
  }

  var yearStart = parseInt(minStartDT.substring(0, 4));
  var yearEnd = parseInt(maxEndDT.substring(0, 4));

  for (var i = yearStart; i <= yearEnd; i++) {
    var monthStart = i == yearStart ? parseInt(minStartDT.substring(4, 6)) : 1;
    var monthEnd = i == yearEnd ? parseInt(maxEndDT.substring(4, 6)) : 12;

    for (var j = monthStart; j <= monthEnd; j++) {
      var optionDateStr = i.zf(4) + j.zf(2);

      if (locale == "ko") {
        $("#calendar_date").append(
          '<option value="' +
            optionDateStr +
            '"' +
            (nowDateStr == optionDateStr ? " selected" : "") +
            ">" +
            stringUtil.formatDate(optionDateStr, "yyyy년 MM월") +
            "</option>"
        );
      } else {
        $("#calendar_date").append(
          '<option value="' +
            optionDateStr +
            '"' +
            (nowDateStr == optionDateStr ? " selected" : "") +
            ">" +
            dateUtil.getEngMonthNm(optionDateStr + "01", "S") +
            " " +
            optionDateStr.substring(0, 4) +
            "</option>"
        );
      }
    }
  }
}

// 달력 날짜 데이터(2주)
function getCalendarView(sYearMonth) {
  var minStartDate = minStartDT.substring(0, 6);

  if (sYearMonth < minStartDate) {
    sYearMonth = minStartDate;
  }

  $("#calendarShowDate").val(sYearMonth);

  $.ajax({
    url: "/https://ticket.leeum.org/leeum/personal/getCalendarListJson.do",
    type: "POST",
    contentType: "application/x-www-form-urlencoded; charset=utf-8",
    data: {
      foundCd: "M30",
      locCd: "3",
      date: sYearMonth,
    },
    dataType: "json",
    cache: false,
    success: function (data) {
      var html = "";

      var nDate = dateUtil.getToday("");
      //var toHour = dateUtil.getHour('');

      /*if(toHour>=17){
                    nDate = dateUtil.addDate(nDate, 1);
                }*/
      /*console.log(nDate);*/

      var firstDay, firstDate, lastDate, maxCellCount;

      // 현재월 기준으로 달력(그리드) 구성하는 cell 갯수
      firstDay =
        sYearMonth.substring(0, 4) + "-" + sYearMonth.substring(4, 6) + "-01";
      firstDate = new Date(firstDay);
      lastDate = new Date(firstDay);
      lastDate.setMonth(lastDate.getMonth() + 1);
      lastDate.setDate(lastDate.getDate() - 1);
      maxCellCount =
        lastDate.getDate() + firstDate.getDay() + (6 - lastDate.getDay());

      $.each(data.calendarList, function (i, item) {
        if (i === maxCellCount) return false;

        var iYearMonth = parseInt(
          stringUtil.formatDate(item.DAY_STR, "yyyyMM")
        );
        var iDay = parseInt(stringUtil.formatDate(item.DAY_STR, "dd"));

        html += (i + 1) % 7 == 1 ? "<tr>" : "";

        var selectDateCheck =
          $("#calendarSelectDate").val() == item.DAY_STR ? " pick_day" : "";
        var dayCultureCheck = item.DAY_STR == item.DAY_CULTURE ? "Y" : "N";

        if (iYearMonth !== parseInt(sYearMonth)) {
          html += '<td class="past_day"></td>';
        } else {
          if (item.DAY_STR == item.DAY_CLOSED) {
            html +=
              '<td class="closed_day"><a href="#" title=""><span>휴관</span></a></td>';

            // 오늘 ~ 2주전 가능 제약
          } else if (!getTwoWeekChk(item.DAY_STR)) {
            html +=
              '<td class="past_day"><a href="#" title=""><span>' +
              iDay +
              "</span></a></td>";
          } else {
            switch (dateUtil.compare(nDate, item.DAY_STR)) {
              case -1:
                if (iYearMonth > sYearMonth) {
                  if (item.DAY_STR == item.DAY_CLOSED) {
                    html +=
                      '<td class="closed_day"><a href="#" title=""><span>휴관</span></a></td>';
                  } else {
                    html +=
                      '<td class="past_day"><a href="#" title=""><span>' +
                      iDay +
                      "</span></a></td>";
                  }
                } else {
                  if (item.DAY_STR >= minStartDT && item.DAY_STR <= maxEndDT) {
                    html +=
                      '<td class="select_day' +
                      selectDateCheck +
                      '"><a href="#" title="예약 가능일"><span>' +
                      iDay +
                      '</span></a><input class="select_date" type="hidden" value="' +
                      item.DAY_STR +
                      '" /><input class="culture_check" type="hidden" value="' +
                      dayCultureCheck +
                      '" /></td>';
                  } else {
                    html +=
                      '<td><a href="#" title="예약 가능일"><span>' +
                      iDay +
                      "</span></a></td>";
                  }
                }
                break;
              case 0:
                if (iYearMonth == sYearMonth) {
                  if (item.DAY_STR >= minStartDT && item.DAY_STR <= maxEndDT) {
                    html +=
                      '<td class="select_day' +
                      selectDateCheck +
                      '"><a href="#" title="예약 가능일"><span>' +
                      iDay +
                      '</span></a><input class="select_date" type="hidden" value="' +
                      item.DAY_STR +
                      '" /><input class="culture_check" type="hidden" value="' +
                      dayCultureCheck +
                      '" /></td>';
                  } else {
                    html +=
                      '<td><a href="#" title="예약 가능일"><span>' +
                      iDay +
                      "</span></a></td>";
                  }
                } else {
                  html +=
                    '<td class="past_day"><a href="#" title=""><span>' +
                    iDay +
                    "</span></a></td>";
                }
                break;
              case 1:
                if (iYearMonth > sYearMonth) {
                  if (item.DAY_STR == item.DAY_CLOSED) {
                    html +=
                      '<td class="closed_day"><a href="#" title=""><span>휴관</span></a></td>';
                  } else {
                    html +=
                      '<td class="past_day"><a href="#" title=""><span>' +
                      iDay +
                      "</span></a></td>";
                  }
                } else {
                  html +=
                    '<td><a href="#" title="예약 가능일"><span>' +
                    iDay +
                    "</span></a></td>";
                }
                break;
              default:
                break;
            }
          }
        }

        html += (i + 1) % 7 == 0 ? "</tr>" : "";
      });

      $("#calendar_body").html(html);
    },
  });

  getMoveMonthButtonView(sYearMonth);
}

function getCurrentMonth() {
  var returnval;
  var toDate = dateUtil.getToday("");
  if (dateUtil.getHour("") >= 18) {
    toDate = dateUtil.addDate(toDate, 14); //15
  }
  returnval = toDate.substring(0, 6);
  return returnval;
}

// 오늘  ~ 2주전 가능 체크
function getTwoWeekChk(dayVal) {
  var rtnVal = false;
  var toDate = dateUtil.getToday("");
  var twoWeekDay = dateUtil.addDate(toDate, 14); //14
  if (dateUtil.getHour("") >= 18) {
    twoWeekDay = dateUtil.addDate(toDate, 15); //15
  }
  if (dayVal == null || dayVal == "" || dayVal == "undefined") {
    return rtnVal;
  }
  toDate *= 1;
  dayVal *= 1;
  twoWeekDay *= 1;
  if (toDate <= dayVal && dayVal < twoWeekDay) {
    rtnVal = true;
  }

  return rtnVal;
}

// 달력 selectbox 이벤트
function changeCalendarSelectView($this) {
  var selectDate = $this.value;
  getCalendarView(selectDate);
}

// 달력 이전, 다음 버튼 이벤트
function moveMonth(monthValue) {
  var calendarShowDate = $("#calendarShowDate").val();
  var moveDate = dateUtil.addMonth(calendarShowDate + "01", monthValue);

  // 달력 selectbox 설정
  $("#calendar_date").val(moveDate.substring(0, 6));

  getCalendarView(moveDate.substring(0, 6));
}

// 달력 이전, 다음 버튼 활성화 체크
function getMoveMonthButtonView(moveDate) {
  var minStartDate = minStartDT.substring(0, 6);
  var maxEndDate = maxEndDT.substring(0, 6);

  // 이전 버튼 체크
  if (moveDate == minStartDate) {
    $("#calendar_previousBtn").off("click");
    $("#calendar_previousBtn").addClass("disabled");
  } else {
    $("#calendar_previousBtn")
      .off("click")
      .on("click", function () {
        moveMonth(-1);
      });
    $("#calendar_previousBtn").removeClass("disabled");
  }

  // 다음 버튼 체크
  if (moveDate == maxEndDate) {
    $("#calendar_nextBtn").off("click");
    $("#calendar_nextBtn").addClass("disabled");
  } else {
    $("#calendar_nextBtn")
      .off("click")
      .on("click", function () {
        moveMonth(1);
      });
    $("#calendar_nextBtn").removeClass("disabled");
  }
}

// 스케쥴 데이터
function getTimeView(selectDate) {
  $("#calendarSelectDate").val(selectDate);

  $.ajax({
    url: "https://ticket.leeum.org/leeum/personal/getTimeListJson.do",
    type: "POST",
    contentType: "application/x-www-form-urlencoded; charset=utf-8",
    data: {
      foundCd: "M30",
      locCd: "3",
      eventCd: "202104|202202|202301",
      placeGrp: "2",
      planExhibit: "",
      limitedMuzCd: "010000",
      limitedEventCd: "202202202301",
      selectGbn: "202202",
      date: selectDate,
    },
    dataType: "json",
    cache: false,
    success: function (data) {
      var nowDate = dateUtil.getToday("");
      var nowTime = dateUtil.getTime("");

      var dataN2 =
        data.timeList != null ? Math.round(data.timeList.length / 2) : 0;

      $("#time_body2").find(".clickTime_left").html("");
      $("#time_body2").find(".clickTime_right").html("");

      $.each(data.timeList, function (i, item) {
        var html = "";
        var timeCheck = "";
        var clsname = "";

        var possibleCnt =
          parseInt(item.PERSON_CNT) -
          (parseInt(item.RSV_CNT) +
            parseInt(item.GRP_RSV_CNT) +
            parseInt(item.ENT_CNT));

        if (possibleCnt <= 0) {
          timeCheck = "sold_out";
          clsname = "sold_out";
        }

        if (nowDate + nowTime > selectDate + item.SCHEDULE_TIME + "00") {
          timeCheck = "closed";
          clsname = "sold_out";
        }

        html += '<li class="select_time ' + clsname + '">';
        html += '<a href="#" title="">';

        if (timeCheck == "") {
          html +=
            '<span class="date">' +
            item.SCHEDULE_TIME.substring(0, 2) +
            ":" +
            item.SCHEDULE_TIME.substring(2, 4) +
            "</span>";
          if (locale == "ko") {
            html += "<span>예약 가능</span>";
          } else {
            html += "<span>Available</span>";
          }
        } else {
          html +=
            '<span class="date" style="float:left;">' +
            item.SCHEDULE_TIME.substring(0, 2) +
            ":" +
            item.SCHEDULE_TIME.substring(2, 4) +
            "</span>";
          if (timeCheck == "closed") {
            html += '<span style="float:right;">마감</span>';
          } else {
            html += '<span style="float:right;">매진</span>';
          }
        }

        html +=
          '<input type="hidden" name="possibleCnt" value="' +
          possibleCnt +
          '" />';

        html += "</a>";
        html += "</li>";

        if (i < dataN2) {
          $("#time_body2").find(".clickTime_left").append(html);
        } else {
          $("#time_body2").find(".clickTime_right").append(html);
        }
      });

      $("#calendarSelectTimeSeq").val(data.commonMap.seq);

      nextOpen(0);
    },
  });
}

// 인원 데이터
function getPeopleView() {
  var selectDate = $("#calendarSelectDate").val();

  var cultureCheck = $("#cultureDayYn").val();

  $.ajax({
    url: "https://ticket.leeum.org/leeum/personal/getPeopleListJson.do",
    type: "POST",
    contentType: "application/x-www-form-urlencoded; charset=utf-8",
    data: {
      muzCd: "110110",
      gubun: cultureCheck == "N" ? "1" : "3",
      locCd: "3",
      date: selectDate,
      limitedMuzCd: "010000",
      selectGbn: "202202",
    },
    dataType: "json",
    cache: false,
    success: function (data) {
      var html = "";

      var possibleCnt = $("#calendarPossibleCnt").val();

      html += '<div class="num_check">';

      $.each(data.peopleList, function (i, item) {
        html += '<div class="choice_box">';
        html += "    <dl>";
        html += "        <dt>" + item.DISPLAY_NM + "</dt>";
        html += "        <dd>";
        if (item.TICK_PRICE != 0) {
          html +=
            "            <strong>" +
            stringUtil.setComma(item.TICK_PRICE) +
            "</strong> <span>원</span>";
        } else {
          html += "            <strong>무료</strong>";
        }
        html += "        </dd>";
        html += "    </dl>";

        var peopleTypeId = "peopleType" + (i + 1).zf(2);

        html += '    <div class="gender" id="' + peopleTypeId + '">';
        html +=
          '        <input type="hidden" id="' +
          peopleTypeId +
          '_muzCd" value="' +
          item.MUZ_CD +
          '" />';
        html +=
          '        <input type="hidden" id="' +
          peopleTypeId +
          '_displayNm" value="' +
          item.DISPLAY_NM +
          '" />';
        html +=
          '        <input type="hidden" id="' +
          peopleTypeId +
          '_floatNm" value="' +
          item.FLOAT_NM +
          '" />';
        html +=
          '        <input type="hidden" id="' +
          peopleTypeId +
          '_tickNm" value="' +
          item.TICK_NM +
          '" />';
        html +=
          '        <input type="hidden" id="' +
          peopleTypeId +
          '_gubun" value="' +
          item.GUBUN +
          '" />';
        html +=
          '        <input type="hidden" id="' +
          peopleTypeId +
          '_ageGbn" value="' +
          item.AGE_GBN +
          '" />';
        html +=
          '        <input type="hidden" id="' +
          peopleTypeId +
          '_tickCd" value="' +
          item.TICK_CD +
          '" />';
        html +=
          '        <input type="hidden" id="' +
          peopleTypeId +
          '_tickPrice" value="' +
          item.TICK_PRICE +
          '" />';
        html +=
          '        <input type="radio" id="' +
          peopleTypeId +
          '_0" name="' +
          peopleTypeId +
          '" value="0" checked />';
        html += '        <label for="' + peopleTypeId + '_0">0</label>';
        html +=
          '        <input type="radio" id="' +
          peopleTypeId +
          '_1" name="' +
          peopleTypeId +
          '" value="1" ' +
          (possibleCnt >= 1 ? "" : "disabled") +
          "/>";
        html += '        <label for="' + peopleTypeId + '_1">1</label>';
        html +=
          '        <input type="radio" id="' +
          peopleTypeId +
          '_2" name="' +
          peopleTypeId +
          '" value="2" ' +
          (possibleCnt >= 2 ? "" : "disabled") +
          "/>";
        html += '        <label for="' + peopleTypeId + '_2">2</label>';
        html +=
          '        <input type="radio" id="' +
          peopleTypeId +
          '_3" name="' +
          peopleTypeId +
          '" value="3" ' +
          (possibleCnt >= 3 ? "" : "disabled") +
          "/>";
        html += '        <label for="' + peopleTypeId + '_3">3</label>';
        html +=
          '        <input type="radio" id="' +
          peopleTypeId +
          '_4" name="' +
          peopleTypeId +
          '" value="4" ' +
          (possibleCnt >= 4 ? "" : "disabled") +
          "/>";
        html += '        <label for="' + peopleTypeId + '_4">4</label>';
        /*html += '        <input type="radio" id="' + peopleTypeId + '_5" name="' + peopleTypeId + '" value="5" ' + (possibleCnt >= 5 ? '' : 'disabled') + '/>';
					html += '        <label for="' + peopleTypeId + '_5">5</label>';*/
        html += "    </div>";
        html += "</div>";
      });

      html += "</div>";

      $("#people_body").html(html);

      nextOpen(1);
    },
  });
}

function updateTotalPriceView() {
  var totalPeople = 0;
  var totalPrice = 0;

  var myPeopleStr = "";

  $("div[id^=peopleType]").each(function (i) {
    var peopleTypeId = $(this).attr("id");

    var peopleCnt = parseInt(
      $('input:radio[name="' + peopleTypeId + '"]:checked').val()
    );

    var floatNm = $("#" + peopleTypeId + "_floatNm").val();
    var tickPrice = parseInt($("#" + peopleTypeId + "_tickPrice").val());
    var ageGbn = $("#" + peopleTypeId + "_ageGbn").val();

    if (ageGbn == "5") {
      $("#selectPreschoolerCnt").val(peopleCnt);
    }

    if (peopleCnt != 0) {
      myPeopleStr +=
        (myPeopleStr != "" ? ", " : "") + floatNm + " " + peopleCnt;
    }

    totalPeople += peopleCnt;
    totalPrice += tickPrice * peopleCnt;
  });

  // 인원선택 정보 업데이트
  $("div[id^=peopleType]").each(function (i) {
    var peopleTypeId = $(this).attr("id");

    var peopleCnt = parseInt(
      $('input:radio[name="' + peopleTypeId + '"]:checked').val()
    );

    var possibleCnt = $("#calendarPossibleCnt").val();

    var maxCnt = possibleCnt <= 4 ? possibleCnt : 4;

    for (var j = peopleCnt + 1, k = 1; j <= 4; j++, k++) {
      if (maxCnt - totalPeople >= k) {
        $("#" + peopleTypeId + "_" + j).attr("disabled", false);
      } else {
        $("#" + peopleTypeId + "_" + j).attr("disabled", true);
      }
    }
  });

  $("#floatPC_people, #floatMO_people").text("인원 - " + myPeopleStr);
  $("#displayPeople").val(myPeopleStr);
  $("#totalPrice_strong").text(stringUtil.setComma(totalPrice));
  $("#totalPrice_span").text("원");
  $("#totalPeople").val(totalPeople);

  if (totalPeople != 0) {
    $("#selectInfoCheck").addClass("on");
    $("#selectInfoCheck").off("click").on("click", selectInfoCheck);
  } else {
    $("#selectInfoCheck").removeClass("on").off("click");
  }
}

// 잔여인원 수 체크, 인원 선점하기 -> 페이지 이동
function selectInfoCheck() {
  var totalPeople = $("#totalPeople").val();
  var preschoolerCnt = $("#selectPreschoolerCnt").val();

  // 미취학아동 인원 체크
  var roundCnt = Math.round(preschoolerCnt / 2);

  if (roundCnt > totalPeople - preschoolerCnt) {
    $("#pop_layer_02").show();
    return false;
  }

  var timeStr = stringUtil.replaceAll($("#calendarSelectTime").val(), ":", "");

  $.ajax({
    url: "/leeum/personal/getSelectInfoCheck.do",
    type: "POST",
    contentType: "application/x-www-form-urlencoded; charset=utf-8",
    data: {
      foundCd: "M30",
      locCd: "3",
      eventCd: "202104|202202|202301",
      placeGrp: "2",
      planExhibit: "",
      date: $("#calendarSelectDate").val(),
      time: timeStr,
      totalPeople: parseInt(totalPeople),
      limitedMuzCd: "010000",
      limitedEventCd: "202202202301",
      selectGbn: "202202",
    },
    dataType: "json",
    cache: false,
    success: function (data) {
      var result = data.result;

      if (result) {
        movePageCheck();
      } else {
        var falseGbn = data.false_gbn;

        if (falseGbn == 1) {
          $("#pop_layer_05").show();
          return false;
        }
      }
    },
  });
}

// 이동할 페이지 체크
function movePageCheck() {
  var tickCdStr = "";
  var tickCntStr = "";

  var totalPrice = 0;

  $("div[id^=peopleType]").each(function (i) {
    var peopleTypeId = $(this).attr("id");

    var tickCd = $("#" + peopleTypeId + "_tickCd").val();
    var tickCnt = parseInt(
      $('input:radio[name="' + peopleTypeId + '"]:checked').val()
    );
    var tickPrice = parseInt($("#" + peopleTypeId + "_tickPrice").val());

    if (tickCnt != 0) {
      tickCdStr += (tickCdStr != "" ? "|" : "") + tickCd;
      tickCntStr += (tickCntStr != "" ? "|" : "") + tickCnt;
      totalPrice += tickPrice * tickCnt;
    }
  });

  $("#tickCd").val(tickCdStr);
  $("#tickCnt").val(tickCntStr);
  $("#totalPrice").val(totalPrice);
  $("#mdate").val($("#calendarSelectDate").val());
  $("#eTime").val(
    stringUtil.replaceAll($("#calendarSelectTime").val(), ":", "")
  );

  var moveForm = $("#moveForm");

  var loginGbn = false;

  if (loginGbn) {
    $("#countryNo").val("82");
    $("#countryCode").val("KOR");
    moveForm.attr("action", "/leeum/personal/personalConfirm.do");
  } else {
    var gstLoginGbn = false;
    if (gstLoginGbn) {
      moveForm.attr("action", "/leeum/personal/personalConfirm.do");
    } else {
      moveForm.attr("action", "/leeum/login.do");
    }
  }

  moveForm.submit();
}

// 날짜선택 및 시간선택 정보 업데이트
function updateClickDayView(thisValue) {
  $(".select_day").removeClass("pick_day");
  $(".select_day > a").attr("title", "예약 가능일");
  thisValue.parents(".select_day").addClass("pick_day");
  thisValue.attr("title", "예약 선택일");

  $(".select_time").removeClass("pick");
  $("#step2").removeClass("open");
  $(".stepChk > li").eq(2).find(".accordion_cont").slideUp(400);
  $(".stepChk > li").eq(2).removeClass("open");
  var selectDate = thisValue.parents(".select_day").find(".select_date").val();
  $("#cultureDayYn").val(
    thisValue.parents(".select_day").find(".culture_check").val()
  );
  getTimeView(selectDate);
  if (locale == "ko") {
    $("#floatPC_daytime, #floatMO_daytime").text(
      "일시 - " +
        stringUtil.formatDate(selectDate, "MM월 dd일") +
        "(" +
        dateUtil.getDayNm(selectDate, locale) +
        ")"
    );
  } else {
    $("#floatPC_daytime, #floatMO_daytime").text(
      "일시 - " +
        dateUtil.getEngMonthNm(selectDate, "S") +
        " " +
        selectDate.substring(6, 8) +
        " (" +
        dateUtil.getDayNm(selectDate, locale) +
        ")"
    );
  }
  $("#floatPC_people, #floatMO_people").text("인원 - ");

  // 금액
  $("#totalPrice_strong").text("");
  $("#totalPrice_span").text("");

  $("#totalPeople").val("0");
  $("#selectInfoCheck").removeClass("on").off("click");
  $("#step1 .tit")
    .off("click")
    .on("click", function () {
      titleClickOpenEvent($(this));
    });
  $("#step2 .tit").off("click");
}

// 시간선택 및 인원선택 정보 업데이트
function updateClickTimeView(thisValue) {
  $(".select_time").removeClass("pick");
  $(".select_time > a").attr("title", "");
  thisValue.parents(".select_time").addClass("pick");
  thisValue.attr("title", "시간 선택됨");

  getPeopleView();
  $("#calendarSelectTime").val(thisValue.find(".date").text());
  $("#calendarPossibleCnt").val(
    thisValue.find('input[name="possibleCnt"]').val()
  );
  $("#selectPreschoolerCnt").val("0");
  var selectDate = $("#calendarSelectDate").val();
  if (locale == "ko") {
    $("#floatPC_daytime, #floatMO_daytime").text(
      "일시 - " +
        stringUtil.formatDate(selectDate, "MM월 dd일") +
        "(" +
        dateUtil.getDayNm(selectDate, locale) +
        ") " +
        thisValue.find(".date").text()
    );
  } else {
    $("#floatPC_daytime, #floatMO_daytime").text(
      "일시 - " +
        dateUtil.getEngMonthNm(selectDate, "S") +
        " " +
        selectDate.substring(6, 8) +
        " (" +
        dateUtil.getDayNm(selectDate, locale) +
        ") " +
        thisValue.find(".date").text()
    );
  }
  $("#floatPC_people, #floatMO_people").text("인원 - ");

  $("#totalPrice_strong").text("");
  $("#totalPrice_span").text("");

  $("#totalPeople").val("0");
  $("#selectInfoCheck").removeClass("on").off("click");
  $("#step2 .tit")
    .off("click")
    .on("click", function () {
      titleClickOpenEvent($(this));
    });
  $("#popLayer01ShowYn").val("N");
}

// 인원선택 체크
function clickPeopleCheck($this) {
  var pepleTypeId = $this.attr("for");

  var disabled = $("#" + pepleTypeId).prop("disabled");

  if (disabled) {
    // 인원 숫자 버튼 비활성화 상태

    var possibleCnt = $("#calendarPossibleCnt").val();

    if (possibleCnt >= 5) {
      $("#pop_layer_03").show();
    } else {
      $("#pop_layer_04").show();
    }

    return false;
  } else {
    // 인원 숫자 버튼 활성화 상태

    var clickId = pepleTypeId.split("_")[0];

    // 클릭한 권종에 대한 원래인원, 클릭인원
    var bValue = parseInt(
      $('input:radio[name="' + clickId + '"]:checked').val()
    );
    var cValue = parseInt(pepleTypeId.split("_")[1]);

    var totalPeople = parseInt($("#totalPeople").val()) + (cValue - bValue);
    var possibleCnt = parseInt($("#calendarPossibleCnt").val());
    var preschoolerCnt = parseInt($("#selectPreschoolerCnt").val());

    var ageGbn = $("#" + clickId + "_ageGbn").val();

    // 권종 체크 (미취학아동)
    if (ageGbn == "5") {
      preschoolerCnt += cValue - bValue;
    }

    var roundCnt = Math.round(preschoolerCnt / 2);

    // 미취학 아동의 보호자 인원 체크
    if (roundCnt > totalPeople - preschoolerCnt) {
      $("#pop_layer_02").show();
      return false;
    }

    if (ageGbn == "5" && $("#popLayer01ShowYn").val() == "N") {
      $("#popLayer01ShowYn").val("Y");
      $("#pop_layer_01").show();
    }

    return true;
  }
}

function calendar_refresh() {
  WG_StartWebGate(
    1742, // GATE-ID
    function () {
      /*var sYearMonth = dateUtil.getToday('').substring(0, 6);
                var twoWeekDay = getCurrentMonth();
                if(sYearMonth < twoWeekDay) {
                    sYearMonth = twoWeekDay;
                }*/
      var calendarShowDate = $("#calendarShowDate").val();
      $("#calendar_date").val(calendarShowDate);
      getCalendarView(calendarShowDate);
    },
    "FRONTEND", // fixed
    "서비스 접속대기 중(Please wait.)", // 대기UI 제목
    false, // fixed
    function () {
      // 유량제어 서비스 장애 시 처리
      var calendarShowDate = $("#calendarShowDate").val();
      $("#calendar_date").val(calendarShowDate);
      getCalendarView(calendarShowDate);
    }
  );

  let today = new Date();
  let currentMonth = today.getMonth();
  let currentYear = today.getFullYear();

  function buildCalendar() {
    let firstDay = new Date(currentYear, currentMonth, 1);
    let lastDay = new Date(currentYear, currentMonth + 1, 0);
    let calendarTitle = document.getElementById("calendarTitle");
    let calendar_body = document.getElementById("calendar_body");
    let twoWeeksFromToday = new Date();
    twoWeeksFromToday.setDate(twoWeeksFromToday.getDate() + 14);

    calendarTitle.innerHTML = currentYear + "년 " + (currentMonth + 1) + "월";

    while (calendar_body.firstChild) {
      calendar_body.removeChild(calendar_body.firstChild);
    }

    let date = 1;
    for (let i = 0; i < 6; i++) {
      let row = document.createElement("tr");
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDay.getDay()) {
          let cell = document.createElement("td");
          let cellText = document.createTextNode("");
          cell.appendChild(cellText);
          row.appendChild(cell);
        } else if (date > lastDay.getDate()) {
          break;
        } else {
          let cell = document.createElement("td");
          let cellText = document.createTextNode(date);
          if (
            date === today.getDate() &&
            currentMonth === today.getMonth() &&
            currentYear === today.getFullYear()
          ) {
            cell.classList.add("current-day");
          }
          if (
            date > today.getDate() &&
            date <= twoWeeksFromToday &&
            currentMonth === today.getMonth() &&
            currentYear === today.getFullYear()
          ) {
            cell.classList.add("two-weeks");
          }
          cell.appendChild(cellText);
          row.appendChild(cell);
          date++;
        }
      }
      calendar_body.appendChild(row);
    }
  }

  function prevCalendar() {
    currentYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    currentMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    buildCalendar();
  }

  function nextCalendar() {
    currentYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    currentMonth = (currentMonth + 1) % 12;
    let twoWeeksFromToday = new Date();
    twoWeeksFromToday.setDate(twoWeeksFromToday.getDate() + 14);
    buildCalendar();
  }

  buildCalendar();
}
