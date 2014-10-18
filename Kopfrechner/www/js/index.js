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


function onLoad()
{
    console.log('binding events');
    var getInt = function (minInclusive, maxInclusive) {
        return Math.round(Math.random() * (maxInclusive - minInclusive)) + minInclusive;
    };
    var getAny = function (array) {
        return array[getInt(0, array.length - 1)];
    };

    var modeEasy = function () {
        var self = this;
        self.id = "easy";
        self.display = "Einfach";
        self.setActive = function () {
            model.curMode(self.id);
        };
        self.isActive = function () {
            return model.curMode() === self.id;
        };
        self.create = function () {
            return {
                next: function () {
                    while (true) {
                        var x = getInt(1, 10);
                        var y = getInt(1, 10);
                        var op = getAny(['-', '*', '+', '/']);
                        switch (op) {
                            case '-':
                                return {
                                    targetNr: x.toString(),
                                    formula: (x + y) + "-" + y + "="
                                };
                            case '+':
                                return {
                                    targetNr: (x + y).toString(),
                                    formula: x + "+" + y + "="
                                };
                            case '*':
                                return {
                                    targetNr: (x * y).toString(),
                                    formula: x + "*" + y + "="
                                };
                            case '/':
                                return {
                                    targetNr: x.toString(),
                                    formula: (x * y) + "/" + y + "="
                                };

                        }
                    }
                }
            };
        };
    };
    var modeRandom = function () {
        var self = this;
        self.id = "random";
        self.display = "Zufall";
        self.setActive = function () {
            model.curMode(self.id);
        };
        self.isActive = function () {
            return model.curMode() === self.id;
        };
        self.create = function () {
            return {
                next: function () {
                    while (true) {
                        var x = getInt(100, 9999);
                        var y = getInt(2, 10);
                        if ((x * y) > 9999)
                            continue;
                        return {
                            targetNr: (x * y).toString(),
                            formula: x + "*" + y + "="
                        }
                    }
                }
            }
        }
    }
    var modeTower = function () {
        var self = this;
        self.id = "tower";
        self.display = "Turm-rechnung";
        self.setActive = function () {
            model.curMode(self.id);
        };
        self.isActive = function () {
            return model.curMode() === self.id;
        };
        self.create = function () {
            var startNr = 1;
            var _retval = {
                index: -1,
                list: [],
                next: function () {
                    _retval.index++;
                    if (_retval.index >= _retval.list.length)
                        return false;
                    return _retval.list[_retval.index];
                }
            }
            for (var i = 2; i < 10; ++i) {
                var formula = startNr + " * " + i;
                startNr *= i;
                _retval.list.push({
                    targetNr: startNr,
                    formula: formula
                });
            }
            for (var i = 2; i < 10; ++i) {
                var formula = startNr + " / " + i;
                startNr /= i;
                _retval.list.push({
                    targetNr: startNr,
                    formula: formula
                });
            }
            return _retval;
        };
    };
    var model = {
        challengeRunning: ko.observable(false),
        curMode: ko.observable("random"),
        curLayout: ko.observable("123"),
        is123: function () {
            return model.curLayout() === "123";
        },
        is789: function () {
            return model.curLayout() === "789";
        },
        set123: function () {
            model.curLayout("123");
        },
        set789: function () {
            model.curLayout("789");
        },
        startChallenge: function (timeLimit)
        {
            var x = ko.utils.arrayFirst(ko.unwrap(model.modes), function (mode) {
                return mode.isActive();
            });
            model.score(0);
            model.challenge = x.create();
            model.newCalculation();
        },
        start5MinChallenge: function () {
            model.startChallenge(5);
        },
        modes: [new modeEasy(), new modeRandom(), new modeTower()],
        challenge: {
        },
        newCalculation: function () {
            var calc = model.challenge.next();
            if (calc === false) {
                model.challengeRunning(false);
                return;
            }
            model.calculation(calc.formula);
            model.targetNr(calc.targetNr.toString());
            model.nr("");
            model.challengeRunning(true);
        },
        calculation: ko.observable("34 * 5"),
        targetNr: ko.observable("170"),
        nr: ko.observable(""),
        getDigit: function (pos) {
            var nr = model.nr().toString();
            if (pos >= nr.length)
                return "-";
            return nr.substr(nr.length - pos - 1, 1);
        },
        digit0: ko.pureComputed(function () {
            return model.getDigit(0);
        }),
        digit1: ko.pureComputed(function () {
            return model.getDigit(1);
        }),
        digit2: ko.pureComputed(function () {
            return model.getDigit(2);
        }),
        digit3: ko.pureComputed(function () {
            return model.getDigit(3);
        }),
        score: ko.observable(0),
        pressOK: function () {
            if (model.targetNr() === model.nr()) {
                model.score(model.score() + 1);
            } else {
                model.score(model.score() - 1);
            }
            model.newCalculation();
            console.log(model.score())
        },
        pressClear: function () {
            model.nr("");
        },
        press0: function () {
            model.press(0)
        },
        press1: function () {
            model.press(1)
        },
        press2: function () {
            model.press(2)
        },
        press3: function () {
            model.press(3)
        },
        press4: function () {
            model.press(4)
        },
        press5: function () {
            model.press(5)
        },
        press6: function () {
            model.press(6)
        },
        press7: function () {
            model.press(7)
        },
        press8: function () {
            model.press(8)
        },
        press9: function () {
            model.press(9)
        },
        press: function (digit) {
            model.nr(digit + model.nr());
        }
    }
    ko.applyBindings(model);
}

onLoad()