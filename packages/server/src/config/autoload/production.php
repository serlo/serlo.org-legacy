<?php
/**
 * This file is part of Athene2.
 *
 * Copyright (c) 2013-2019 Serlo Education e.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @copyright Copyright (c) 2013-2019 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/athene2 for the canonical source repository
 */

return [
    // Mailman Module
    'mailman' => [
        'sender' => 'notifications@mail.serlo.org',
        'location' => 'https://www.serlo.org',
    ],

    // (Ui Module)
    'view_manager' => [
        'display_exceptions' => false,
    ],
    'tracking' => [
        'instances' => [
            'deutsch' => [
                'code' => <<<EOL
<script type="text/javascript">
    (function(h,o,t,j,a,r){
        h._hjSettings={hjid:306257,hjsv:5};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
    })(window,document,'//static.hotjar.com/c/hotjar-','.js?sv=');
</script>
<script type="text/javascript">
var disableStr='ga-disable-UA-20283862-3';if(document.cookie.indexOf(disableStr+'=true')>-1){window[disableStr]=true;}
function gaOptout(){document.cookie=disableStr+'=true; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/';window[disableStr]=true;}
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
ga('create', 'UA-20283862-3', 'serlo.org');ga('require', 'displayfeatures');ga('require', 'linkid', 'linkid.js');ga('set', 'anonymizeIp', true);ga('send', 'pageview');
var visitTookTime = false;var didScroll = false;var bounceSent = false;var scrollCount=0;
function testScroll(){++scrollCount;if(scrollCount==2){didScroll=true}sendNoBounce()}
function timeElapsed(){visitTookTime=true;sendNoBounce()}
function sendNoBounce(){if(didScroll&&visitTookTime&&!bounceSent){bounceSent=true;ga("send","event","no bounce","resist","User scrolled and spent 30 seconds on page.")}}
setTimeout("timeElapsed()",3e4);
window.addEventListener?window.addEventListener("scroll",testScroll,false):window.attachEvent("onScroll",testScroll);
</script>
EOL
            ],
            'english' => [
                'code' => <<<EOL
<script type="text/javascript">
    (function(h,o,t,j,a,r){
        h._hjSettings={hjid:306257,hjsv:5};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
    })(window,document,'//static.hotjar.com/c/hotjar-','.js?sv=');
</script>
<script type="text/javascript">
var disableStr='ga-disable-UA-20283862-3';if(document.cookie.indexOf(disableStr+'=true')>-1){window[disableStr]=true;}
function gaOptout(){document.cookie=disableStr+'=true; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/';window[disableStr]=true;}
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
ga('create', 'UA-20283862-3', 'serlo.org');ga('require', 'displayfeatures');ga('require', 'linkid', 'linkid.js');ga('set', 'anonymizeIp', true);ga('send', 'pageview');
var visitTookTime = false;var didScroll = false;var bounceSent = false;var scrollCount=0;
function testScroll(){++scrollCount;if(scrollCount==2){didScroll=true}sendNoBounce()}
function timeElapsed(){visitTookTime=true;sendNoBounce()}
function sendNoBounce(){if(didScroll&&visitTookTime&&!bounceSent){bounceSent=true;ga("send","event","no bounce","resist","User scrolled and spent 30 seconds on page.")}}
setTimeout("timeElapsed()",3e4);
window.addEventListener?window.addEventListener("scroll",testScroll,false):window.attachEvent("onScroll",testScroll);
</script>
EOL
            ],
            'spanish' => [
                'code' => <<<EOL
<script type="text/javascript">
    (function(h,o,t,j,a,r){
        h._hjSettings={hjid:306257,hjsv:5};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
    })(window,document,'//static.hotjar.com/c/hotjar-','.js?sv=');
</script>
<script type="text/javascript">
var disableStr='ga-disable-UA-20283862-3';if(document.cookie.indexOf(disableStr+'=true')>-1){window[disableStr]=true;}
function gaOptout(){document.cookie=disableStr+'=true; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/';window[disableStr]=true;}
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
ga('create', 'UA-20283862-3', 'serlo.org');ga('require', 'displayfeatures');ga('require', 'linkid', 'linkid.js');ga('set', 'anonymizeIp', true);ga('send', 'pageview');
var visitTookTime = false;var didScroll = false;var bounceSent = false;var scrollCount=0;
function testScroll(){++scrollCount;if(scrollCount==2){didScroll=true}sendNoBounce()}
function timeElapsed(){visitTookTime=true;sendNoBounce()}
function sendNoBounce(){if(didScroll&&visitTookTime&&!bounceSent){bounceSent=true;ga("send","event","no bounce","resist","User scrolled and spent 30 seconds on page.")}}
setTimeout("timeElapsed()",3e4);
window.addEventListener?window.addEventListener("scroll",testScroll,false):window.attachEvent("onScroll",testScroll);
</script>
EOL
            ],
            'hindi' => [
                'code' => <<<EOL
<script type="text/javascript">
    (function(h,o,t,j,a,r){
        h._hjSettings={hjid:306257,hjsv:5};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
    })(window,document,'//static.hotjar.com/c/hotjar-','.js?sv=');
</script>
<script type="text/javascript">
var disableStr='ga-disable-UA-20283862-3';if(document.cookie.indexOf(disableStr+'=true')>-1){window[disableStr]=true;}
function gaOptout(){document.cookie=disableStr+'=true; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/';window[disableStr]=true;}
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
ga('create', 'UA-20283862-3', 'serlo.org');ga('require', 'displayfeatures');ga('require', 'linkid', 'linkid.js');ga('set', 'anonymizeIp', true);ga('send', 'pageview');
var visitTookTime = false;var didScroll = false;var bounceSent = false;var scrollCount=0;
function testScroll(){++scrollCount;if(scrollCount==2){didScroll=true}sendNoBounce()}
function timeElapsed(){visitTookTime=true;sendNoBounce()}
function sendNoBounce(){if(didScroll&&visitTookTime&&!bounceSent){bounceSent=true;ga("send","event","no bounce","resist","User scrolled and spent 30 seconds on page.")}}
setTimeout("timeElapsed()",3e4);
window.addEventListener?window.addEventListener("scroll",testScroll,false):window.attachEvent("onScroll",testScroll);
</script>
EOL
            ],
        ],
    ],
];
