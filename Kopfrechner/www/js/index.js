/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('load', this.onLoad, false);
        
        console.log('binding events');
        
        var getInt = function(minInclusive,maxInclusive){
            return Math.round(Math.random()*(maxInclusive-minInclusive))+minInclusive;
        }
        var calculations=[
            {
                text:"simple",
                create:function(){
                    while(true){
                        var x=getInt(100,9999);
                        var y = getInt(2,10);
                        if((x*y)>9999)
                            continue;
                        
                        return {
                            targetNr: (x*y).toString(),
                            formula: x+"*"+y+"="
                        }
                    }
                }
            }
        ];
        var model = {
            newCalculation: function(){
                var calc=calculations[0].create();
                model.calculation(calc.formula);
                model.targetNr(calc.targetNr.toString());
                model.nr("");
            },
            calculation: ko.observable("34 * 5"),
            targetNr: ko.observable("170"),
            nr:ko.observable(""),
            getDigit:function(pos){
                var nr=model.nr().toString();
                if(pos>=nr.length) return "-";
                return nr.substr(nr.length-pos-1, 1);
            },
            digit0:ko.pureComputed(function(){
                return model.getDigit(0);
            }),
            digit1:ko.pureComputed(function(){
                return model.getDigit(1);
            }),
            digit2:ko.pureComputed(function(){
                return model.getDigit(2);
            }),
            digit3:ko.pureComputed(function(){
                return model.getDigit(3);
            }),
            score:ko.observable(0),
            pressOK:function(){
                if(model.targetNr()===model.nr()) {
                    model.score(model.score()+1);
                } else {
                    model.score(model.score()-1);
                }
                model.newCalculation();
                console.log(model.score())
            },
            pressClear:function(){model.nr("");},
            press0:function(){model.press(0)},
            press1:function(){model.press(1)},
            press2:function(){model.press(2)},
            press3:function(){model.press(3)},
            press4:function(){model.press(4)},
            press5:function(){model.press(5)},
            press6:function(){model.press(6)},
            press7:function(){model.press(7)},
            press8:function(){model.press(8)},
            press9:function(){model.press(9)},
            press:function(digit){
                model.nr(digit+model.nr());
            }
        }
        ko.applyBindings(model);
    },
    onLoad:function(){
        console.log("Loaded");
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();