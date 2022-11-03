$(document).ready(function () {
    fireBalls = [];
    queryResult = [];

    $.ajax({
        url: 'https://ssd-api.jpl.nasa.gov/fireball.api?limit=20',
        type: "GET",
        dataType: "json",
        data: {
        },
        success: function (result) {
            fireBalls = result.data;
            populateTable();
        },
        error: function () {
            // do nothing for now
        }
    });

    function populateTable() {
        // Populate initial table
        for (i = 0; i < 5; i++) {
            // Creating new fireball object
            var fireBall = '';
            // Creating new row to store to fireball object
            fireBall += '<tr>';
            fireBall += '<td>' + fireBalls[i][0] + '</td>';
            fireBall += '<td>' + fireBalls[i][1] + '</td>';
            fireBall += '<td>' + fireBalls[i][2] + '</td>';
            fireBall += '<td>' + fireBalls[i][3] + '</td>';
            fireBall += '<td>' + fireBalls[i][4] + '</td>';
            fireBall += '<td>' + fireBalls[i][5] + '</td>';
            fireBall += '<td>' + fireBalls[i][6] + '</td>';
            fireBall += '<td>' + fireBalls[i][7] + '</td>';
            fireBall += '<td>' + fireBalls[i][8] + '</td>';
            fireBall += '</tr>';
            $('#fireballTable tbody').append(fireBall);
        }
    }

    function checkCountry(i, latitude, longitude, country) {
        // firebals[i][3] = latitude
        // fireballs[i][5] = longitude
        // https://nominatim.openstreetmap.org/reverse?format=json&lat=22.7&lon=97.6
        // https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452
        // http://dev.virtualearth.net/REST/v1/Locations/22.7,97.6?o=json&key=AsZq2Bhs0ptlmoQODQoRVY2p9AFdtBORuBLS7Yf5aE9FE8BKJg91d8YlG8xyieHO
        // http://api.positionstack.com/v1/reverse?access_key=5b2f18ac06bc59232150af945df40d0b&query=22.7,97.6
        // ^ console.log(result.data[0].country);
        let currentCountry = "";
        let countryUrl = 'http://api.positionstack.com/v1/reverse?access_key=5b2f18ac06bc59232150af945df40d0b&query=' + latitude + ',' + longitude;

        $.ajax({
            url: countryUrl,
            type: "GET",
            dataType: "json",
            asyn: false,
            data: {
            },
            success: function (result) {
                currentCountry = result.data[0].country;
                // Adding the current country into the fireball records
                queryResult[i].push(currentCountry);
                if (currentCountry == country) {
                    var fireBall = '';
                    fireBall += '<tr>';
                    fireBall += '<td>' + queryResult[i][0] + '</td>';
                    fireBall += '<td>' + queryResult[i][1] + '</td>';
                    fireBall += '<td>' + queryResult[i][2] + '</td>';
                    fireBall += '<td>' + queryResult[i][3] + '</td>';
                    fireBall += '<td>' + queryResult[i][4] + '</td>';
                    fireBall += '<td>' + queryResult[i][5] + '</td>';
                    fireBall += '<td>' + queryResult[i][6] + '</td>';
                    fireBall += '<td>' + queryResult[i][7] + '</td>';
                    fireBall += '<td>' + queryResult[i][8] + '</td>';
                    fireBall += '</tr>';
                    $('#fireballTable tbody').append(fireBall);
                }
            },
            error: function () {
                alert("Country error:" + result);
            }
        });
    }

    // Handle logic for submitting filter
    $("#filterButton").click(function() {
        var country = $("#locationButton").text();
        country = country.replace('Location: ', '');
        var startDate = $("#startButton").text();
        startDate = startDate.replace('Start Date: ','');
        var endDate = $("#endButton").text();
        endDate = endDate.replace('End Date: ','');
        var velMin = $("#velMinButton").text();
        velMin = velMin.replace('Velocity Min: ', '');
        var velMax = $("#velMaxButton").text();
        velMax = velMax.replace('Velocity Max: ', '');
        var engMin = $("#energyMinButton").text();
        engMin = engMin.replace('Energy Min: ','');
        var engMax = $("#energyMaxButton").text();
        engMax = engMax.replace('Energy Max: ','');

        var wantsCountry = true;
        if (country == 'N/A') {
            wantsCountry = false;
        }


        var queryUrl = 'https://ssd-api.jpl.nasa.gov/fireball.api?limit=20';

        if (startDate != "N/A") {
            queryUrl += '&date-min=' + startDate;
        }
        if (endDate != "N/A") {
            queryUrl += '&date-max=' + endDate;
        }
        if (velMin != "N/A") {
            queryUrl += '&vel-min=' + velMin;
        }
        if (velMax != "N/A") {
            queryUrl += '&vel-max=' + velMax;
        }
        if (engMin != "N/A") {
            queryUrl += '&energy-min=' + engMin;
        }
        if (engMax != "N/A") {
            queryUrl += '&energy-max=' + engMax;
        }

        $.ajax({
            url: queryUrl,
            type: "GET",
            dataType: "json",
            data: {
            },
            success: function (result) {
                queryResult = result.data;
                populateTableWithQuery(wantsCountry, country);
            },
            error: function () {
                // do nothing for now
            }
        });
    });

    function populateTableWithQuery(wantsCountry, country) {
        // Clearing previous table content whilst keeping headers
        $('#fireballTable tbody').empty();

        // Populate initial table
        for (var i = 0; i < queryResult.length; i++) {
            // Creating new fireball object
            var fireBall = '';

            if (wantsCountry) {
                var latitude = queryResult[i][3];
                var longitude = queryResult[i][5];

                var latDir = queryResult[i][4];
                var lngDir = queryResult[i][6];

                if (latDir != 'N') {
                    latitude = '-' + latitude;
                }

                if (lngDir != 'E') {
                    longitude = '-' + longitude
                }

                checkCountry(i, latitude, longitude, country);
            } else {
                fireBall += '<tr>';
                fireBall += '<td>' + queryResult[i][0] + '</td>';
                fireBall += '<td>' + queryResult[i][1] + '</td>';
                fireBall += '<td>' + queryResult[i][2] + '</td>';
                fireBall += '<td>' + queryResult[i][3] + '</td>';
                fireBall += '<td>' + queryResult[i][4] + '</td>';
                fireBall += '<td>' + queryResult[i][5] + '</td>';
                fireBall += '<td>' + queryResult[i][6] + '</td>';
                fireBall += '<td>' + queryResult[i][7] + '</td>';
                fireBall += '<td>' + queryResult[i][8] + '</td>';
                fireBall += '</tr>';
                $('#fireballTable tbody').append(fireBall);
            }
        }
    }

    // Handle logic for selecting location button
    $("#locationButton").click(function() {
        $("#inputField").empty();
        var component = '<select id="country" onchange="setCountryFilter()" name="country" class="form-control"><option value="default">Select a Country</option>';
        component += '<option value="Afghanistan">Afghanistan</option>';
        component += '<option value="Åland Islands">Åland Islands</option>';
        component += '<option value="Albania">Albania</option>';
        component += '<option value="Algeria">Algeria</option>';
        component += '<option value="American Samoa">American Samoa</option>';
        component += '<option value="Andorra">Andorra</option>';
        component += '<option value="Angola">Angola</option>';
        component += '<option value="Anguilla">Anguilla</option>';
        component += '<option value="Antarctica">Antarctica</option>';
        component += '<option value="Antigua and Barbuda">Antigua and Barbuda</option>';
        component += '<option value="Argentina">Argentina</option>';
        component += '<option value="Armenia">Armenia</option>';
        component += '<option value="Aruba">Aruba</option>';
        component += '<option value="Australia">Australia</option>';
        component += '<option value="Austria">Austria</option>';
        component += '<option value="Azerbaijan">Azerbaijan</option>';
        component += '<option value="Bahamas">Bahamas</option>';
        component += '<option value="Bahrain">Bahrain</option>';
        component += '<option value="Bangladesh">Bangladesh</option>';
        component += '<option value="Barbados">Barbados</option>';
        component += '<option value="Belarus">Belarus</option>';
        component += '<option value="Belgium">Belgium</option>';
        component += '<option value="Belize">Belize</option>';
        component += '<option value="Benin">Benin</option>';
        component += '<option value="Bermuda">Bermuda</option>';
        component += '<option value="Bhutan">Bhutan</option>';
        component += '<option value="Bolivia">Bolivia</option>';
        component += '<option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>';
        component += '<option value="Botswana">Botswana</option>';
        component += '<option value="Bouvet Island">Bouvet Island</option>';
        component += '<option value="Brazil">Brazil</option>';
        component += '<option value="British Indian Ocean Territory">British Indian Ocean Territory</option>';
        component += '<option value="Brunei Darussalam">Brunei Darussalam</option>';
        component += '<option value="Bulgaria">Bulgaria</option>';
        component += '<option value="Burkina Faso">Burkina Faso</option>';
        component += '<option value="Burundi">Burundi</option>';
        component += '<option value="Cambodia">Cambodia</option>';
        component += '<option value="Cameroon">Cameroon</option>';
        component += '<option value="Canada">Canada</option>';
        component += '<option value="Cape Verde">Cape Verde</option>';
        component += '<option value="Cayman Islands">Cayman Islands</option>';
        component += '<option value="Central African Republic">Central African Republic</option>';
        component += '<option value="Chad">Chad</option>';
        component += '<option value="Chile">Chile</option>';
        component += '<option value="China">China</option>';
        component += '<option value="Christmas Island">Christmas Island</option>';
        component += '<option value="Cocos (Keeling) Islands">Cocos (Keeling) Islands</option>';
        component += '<option value="Colombia">Colombia</option>';
        component += '<option value="Comoros">Comoros</option>';
        component += '<option value="Congo">Congo</option>';
        component += '<option value="Congo, The Democratic Republic of The">Congo, The Democratic Republic of The</option>';
        component += '<option value="Cook Islands">Cook Islands</option>';
        component += '<option value="Costa Rica">Costa Rica</option>';
        component += '<option value="Cote Divoire">Cote Divoire</option>';
        component += '<option value="Croatia">Croatia</option>';
        component += '<option value="Cuba">Cuba</option>';
        component += '<option value="Cyprus">Cyprus</option>';
        component += '<option value="Czech Republic">Czech Republic</option>';
        component += '<option value="Denmark">Denmark</option>';
        component += '<option value="Djibouti">Djibouti</option>';
        component += '<option value="Dominica">Dominica</option>';
        component += '<option value="Dominican Republic">Dominican Republic</option>';
        component += '<option value="Ecuador">Ecuador</option>';
        component += '<option value="Egypt">Egypt</option>';
        component += '<option value="El Salvador">El Salvador</option>';
        component += '<option value="Equatorial Guinea">Equatorial Guinea</option>';
        component += '<option value="Eritrea">Eritrea</option>';
        component += '<option value="Estonia">Estonia</option>';
        component += '<option value="Ethiopia">Ethiopia</option>';
        component += '<option value="Falkland Islands (Malvinas)">Falkland Islands (Malvinas)</option>';
        component += '<option value="Faroe Islands">Faroe Islands</option>';
        component += '<option value="Fiji">Fiji</option>';
        component += '<option value="Finland">Finland</option>';
        component += '<option value="France">France</option>';
        component += '<option value="French Guiana">French Guiana</option>';
        component += '<option value="French Polynesia">French Polynesia</option>';
        component += '<option value="French Southern Territories">French Southern Territories</option>';
        component += '<option value="Gabon">Gabon</option>';
        component += '<option value="Gambia">Gambia</option>';
        component += '<option value="Georgia">Georgia</option>';
        component += '<option value="Germany">Germany</option>';
        component += '<option value="Ghana">Ghana</option>';
        component += '<option value="Gibraltar">Gibraltar</option>';
        component += '<option value="Greece">Greece</option>';
        component += '<option value="Greenland">Greenland</option>';
        component += '<option value="Grenada">Grenada</option>';
        component += '<option value="Guadeloupe">Guadeloupe</option>';
        component += '<option value="Guam">Guam</option>';
        component += '<option value="Guatemala">Guatemala</option>';
        component += '<option value="Guernsey">Guernsey</option>';
        component += '<option value="Guinea">Guinea</option>';
        component += '<option value="Guinea-bissau">Guinea-bissau</option>';
        component += '<option value="Guyana">Guyana</option>';
        component += '<option value="Haiti">Haiti</option>';
        component += '<option value="Heard Island and Mcdonald Islands">Heard Island and Mcdonald Islands</option>';
        component += '<option value="Holy See (Vatican City State)">Holy See (Vatican City State)</option>';
        component += '<option value="Honduras">Honduras</option>';
        component += '<option value="Hong Kong">Hong Kong</option>';
        component += '<option value="Hungary">Hungary</option>';
        component += '<option value="Iceland">Iceland</option>';
        component += '<option value="India">India</option>';
        component += '<option value="Indonesia">Indonesia</option>';
        component += '<option value="Iran, Islamic Republic of">Iran, Islamic Republic of</option>';
        component += '<option value="Iraq">Iraq</option>';
        component += '<option value="Ireland">Ireland</option>';
        component += '<option value="Isle of Man">Isle of Man</option>';
        component += '<option value="Israel">Israel</option>';
        component += '<option value="Italy">Italy</option>';
        component += '<option value="Jamaica">Jamaica</option>';
        component += '<option value="Japan">Japan</option>';
        component += '<option value="Jersey">Jersey</option>';
        component += '<option value="Jordan">Jordan</option>';
        component += '<option value="Kazakhstan">Kazakhstan</option>';
        component += '<option value="Kenya">Kenya</option>';
        component += '<option value="Kiribati">Kiribati</option>';
        component += '<option value="Korea, Democratic Peoples Republic of">Korea, Democratic Peoples Republic of</option>';
        component += '<option value="Korea, Republic of">Korea, Republic of</option>';
        component += '<option value="Kuwait">Kuwait</option>';
        component += '<option value="Kyrgyzstan">Kyrgyzstan</option>';
        component += '<option value="Lao Peoples Democratic Republic">Lao Peoples Democratic Republic</option>';
        component += '<option value="Latvia">Latvia</option>';
        component += '<option value="Lebanon">Lebanon</option>';
        component += '<option value="Lesotho">Lesotho</option>';
        component += '<option value="Liberia">Liberia</option>';
        component += '<option value="Libyan Arab Jamahiriya">Libyan Arab Jamahiriya</option>';
        component += '<option value="Liechtenstein">Liechtenstein</option>';
        component += '<option value="Lithuania">Lithuania</option>';
        component += '<option value="Luxembourg">Luxembourg</option>';
        component += '<option value="Macao">Macao</option>';
        component += '<option value="Macedonia, The Former Yugoslav Republic of">Macedonia, The Former Yugoslav Republic of</option>';
        component += '<option value="Madagascar">Madagascar</option>';
        component += '<option value="Malawi">Malawi</option>';
        component += '<option value="Malaysia">Malaysia</option>';
        component += '<option value="Maldives">Maldives</option>';
        component += '<option value="Mali">Mali</option>';
        component += '<option value="Malta">Malta</option>';
        component += '<option value="Marshall Islands">Marshall Islands</option>';
        component += '<option value="Martinique">Martinique</option>';
        component += '<option value="Mauritania">Mauritania</option>';
        component += '<option value="Mauritius">Mauritius</option>';
        component += '<option value="Mayotte">Mayotte</option>';
        component += '<option value="Mexico">Mexico</option>';
        component += '<option value="Micronesia, Federated States of">Micronesia, Federated States of</option>';
        component += '<option value="Moldova, Republic of">Moldova, Republic of</option>';
        component += '<option value="Monaco">Monaco</option>';
        component += '<option value="Mongolia">Mongolia</option>';
        component += '<option value="Montenegro">Montenegro</option>';
        component += '<option value="Montserrat">Montserrat</option>';
        component += '<option value="Morocco">Morocco</option>';
        component += '<option value="Mozambique">Mozambique</option>';
        component += '<option value="Myanmar">Myanmar</option>';
        component += '<option value="Namibia">Namibia</option>';
        component += '<option value="Nauru">Nauru</option>';
        component += '<option value="Nepal">Nepal</option>';
        component += '<option value="Netherlands">Netherlands</option>';
        component += '<option value="Netherlands Antilles">Netherlands Antilles</option>';
        component += '<option value="New Caledonia">New Caledonia</option>';
        component += '<option value="New Zealand">New Zealand</option>';
        component += '<option value="Nicaragua">Nicaragua</option>';
        component += '<option value="Niger">Niger</option>';
        component += '<option value="Nigeria">Nigeria</option>';
        component += '<option value="Niue">Niue</option>';
        component += '<option value="Norfolk Island">Norfolk Island</option>';
        component += '<option value="Northern Mariana Islands">Northern Mariana Islands</option>';
        component += '<option value="Norway">Norway</option>';
        component += '<option value="Oman">Oman</option>';
        component += '<option value="Pakistan">Pakistan</option>';
        component += '<option value="Palau">Palau</option>';
        component += '<option value="Palestinian Territory, Occupied">Palestinian Territory, Occupied</option>';
        component += '<option value="Panama">Panama</option>';
        component += '<option value="Papua New Guinea">Papua New Guinea</option>';
        component += '<option value="Paraguay">Paraguay</option>';
        component += '<option value="Peru">Peru</option>';
        component += '<option value="Philippines">Philippines</option>';
        component += '<option value="Pitcairn">Pitcairn</option>';
        component += '<option value="Poland">Poland</option>';
        component += '<option value="Portugal">Portugal</option>';
        component += '<option value="Puerto Rico">Puerto Rico</option>';
        component += '<option value="Qatar">Qatar</option>';
        component += '<option value="Reunion">Reunion</option>';
        component += '<option value="Romania">Romania</option>';
        component += '<option value="Russian Federation">Russian Federation</option>';
        component += '<option value="Rwanda">Rwanda</option>';
        component += '<option value="Saint Helena">Saint Helena</option>';
        component += '<option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>';
        component += '<option value="Saint Lucia">Saint Lucia</option>';
        component += '<option value="Saint Pierre and Miquelon">Saint Pierre and Miquelon</option>';
        component += '<option value="Saint Vincent and The Grenadines">Saint Vincent and The Grenadines</option>';
        component += '<option value="Samoa">Samoa</option>';
        component += '<option value="San Marino">San Marino</option>';
        component += '<option value="Sao Tome and Principe">Sao Tome and Principe</option>';
        component += '<option value="Saudi Arabia">Saudi Arabia</option>';
        component += '<option value="Senegal">Senegal</option>';
        component += '<option value="Serbia">Serbia</option>';
        component += '<option value="Seychelles">Seychelles</option>';
        component += '<option value="Sierra Leone">Sierra Leone</option>';
        component += '<option value="Singapore">Singapore</option>';
        component += '<option value="Slovakia">Slovakia</option>';
        component += '<option value="Slovenia">Slovenia</option>';
        component += '<option value="Solomon Islands">Solomon Islands</option>';
        component += '<option value="Somalia">Somalia</option>';
        component += '<option value="South Africa">South Africa</option>';
        component += '<option value="South Georgia and The South Sandwich Islands">South Georgia and The South Sandwich Islands</option>';
        component += '<option value="Spain">Spain</option>';
        component += '<option value="Sri Lanka">Sri Lanka</option>';
        component += '<option value="Sudan">Sudan</option>';
        component += '<option value="Suriname">Suriname</option>';
        component += '<option value="Svalbard and Jan Mayen">Svalbard and Jan Mayen</option>';
        component += '<option value="Swaziland">Swaziland</option>';
        component += '<option value="Sweden">Sweden</option>';
        component += '<option value="Switzerland">Switzerland</option>';
        component += '<option value="Syrian Arab Republic">Syrian Arab Republic</option>';
        component += '<option value="Taiwan">Taiwan</option>';
        component += '<option value="Tajikistan">Tajikistan</option>';
        component += '<option value="Tanzania, United Republic of">Tanzania, United Republic of</option>';
        component += '<option value="Thailand">Thailand</option>';
        component += '<option value="Timor-leste">Timor-leste</option>';
        component += '<option value="Togo">Togo</option>';
        component += '<option value="Tokelau">Tokelau</option>';
        component += '<option value="Tonga">Tonga</option>';
        component += '<option value="Trinidad and Tobago">Trinidad and Tobago</option>';
        component += '<option value="Tunisia">Tunisia</option>';
        component += '<option value="Turkey">Turkey</option>';
        component += '<option value="Turkmenistan">Turkmenistan</option>';
        component += '<option value="Turks and Caicos Islands">Turks and Caicos Islands</option>';
        component += '<option value="Tuvalu">Tuvalu</option>';
        component += '<option value="Uganda">Uganda</option>';
        component += '<option value="Ukraine">Ukraine</option>';
        component += '<option value="United Arab Emirates">United Arab Emirates</option>';
        component += '<option value="United Kingdom">United Kingdom</option>';
        component += '<option value="United States">United States</option>';
        component += '<option value="United States Minor Outlying Islands">United States Minor Outlying Islands</option>';
        component += '<option value="Uruguay">Uruguay</option>';
        component += '<option value="Uzbekistan">Uzbekistan</option>';
        component += '<option value="Vanuatu">Vanuatu</option>';
        component += '<option value="Venezuela">Venezuela</option>';
        component += '<option value="Viet Nam">Viet Nam</option>';
        component += '<option value="Virgin Islands, British">Virgin Islands, British</option>';
        component += '<option value="Virgin Islands, U.S.">Virgin Islands, U.S.</option>';
        component += '<option value="Wallis and Futuna">Wallis and Futuna</option>';
        component += '<option value="Western Sahara">Western Sahara</option>';
        component += '<option value="Yemen">Yemen</option>';
        component += '<option value="Zambia">Zambia</option>';
        component += '<option value="Zimbabwe">Zimbabwe</option>';
        component += '</select>';
        $("#inputField").append(component);
    });

    // Handle logic for selecting start date button
    $("#startButton").click(function() {
        $("#inputField").empty();
        var component = '<input type="date" onchange="setStartFilter()" class="datePicker" id="start" name="trip-start" value="" min="1988-04-15" max="2022-12-31" defaultValue="1980-01-15">'; 
        $("#inputField").append(component);
    });

    // Handle logic for selecting start date button
    $("#endButton").click(function() {
        $("#inputField").empty();
        var component = '<input type="date" onchange="setEndFilter()" class="datePicker" id="end" name="trip-start" value="" min="1988-04-15" max="2022-12-31" defaultValue="1980-02-15">'; 
        $("#inputField").append(component);
    });

    $("#velMinButton").click(function() {
        $("#inputField").empty();
        var component = '<input type="number" onchange="setVelMinFilter()"step="0.01" id="velocityMin" class="datePicker" defaultValue="0">'; 
        $("#inputField").append(component);
    });

    $("#velMaxButton").click(function() {
        $("#inputField").empty();
        var component = '<input type="number" onchange="setVelMaxFilter()" step="0.01" id="velocityMax" class="datePicker" defaultValue="0">'; 
        $("#inputField").append(component);
    });

    $("#energyMinButton").click(function() {
        $("#inputField").empty();
        var component = '<input type="number" onchange="setEngMinFilter()" step="0.01" id="energyMin" class="datePicker" defaultValue="0">'; 
        $("#inputField").append(component);
    });

    $("#energyMaxButton").click(function() {
        $("#inputField").empty();
        var component = '<input type="number" onchange="setEngMaxFilter()" step="0.01" id="energyMax" class="datePicker" defaultValue="0">'; 
        $("#inputField").append(component);
    });

    $("#clearFilters").click(function() {
        // Removing Table to populate with 5 most recent records
        $('#fireballTable tbody').empty();
        populateTable();
        // Clearing any input fields
        $("#inputField").empty();
        // Resetting button texts
        document.getElementById("locationButton").innerHTML='Location: N/A'
        document.getElementById("startButton").innerHTML='Start Date: N/A';
        document.getElementById("endButton").innerHTML='End Date: N/A';
        document.getElementById("velMinButton").innerHTML='Velocity Min: N/A';
        document.getElementById("velMaxButton").innerHTML='Velocity Max: N/A';
        document.getElementById("energyMinButton").innerHTML='Energy Min: N/A';
        document.getElementById("energyMaxButton").innerHTML='Energy Max: N/A';
    });

    $("#questionMark").click(function() {
        var x = $("#infoDiv");
        if (x.css("display") === "none") {
            x.css("display","block");
        } else {
            x.css("display","none");
        }
    });
});

// Handle logic for selecting country
function setCountryFilter() {
    searchCountry = document.getElementById("country").value;
    document.getElementById("locationButton").innerHTML='Location: ' + searchCountry;
    $("#inputField").empty();
}

function setStartFilter() {
    startDate = document.getElementById("start").value;
    document.getElementById("startButton").innerHTML='Start Date: ' + startDate;
    $("#inputField").empty();
}

function setEndFilter() {
    endDate = document.getElementById("end").value;
    document.getElementById("endButton").innerHTML='End Date: ' + endDate;
    $("#inputField").empty();
}

function setVelMinFilter() {
    velMin = document.getElementById("velocityMin").value;
    document.getElementById("velMinButton").innerHTML='Velocity Min: ' + velMin;
    $("#inputField").empty();
}

function setVelMaxFilter() {
    velMax = document.getElementById("velocityMax").value;
    document.getElementById("velMaxButton").innerHTML='Velocity Max: ' + velMax;
    $("#inputField").empty();
}

function setEngMinFilter() {
    engMin = document.getElementById("energyMin").value;
    document.getElementById("energyMinButton").innerHTML='Energy Min: ' + engMin;
    $("#inputField").empty();
}

function setEngMaxFilter() {
    engMax = document.getElementById("energyMax").value;
    document.getElementById("energyMaxButton").innerHTML='Energy Max: ' + engMax;
    $("#inputField").empty();
}

