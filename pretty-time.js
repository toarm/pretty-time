const MONTH_MS = 2592000000;
const WEEK_MS = 604800000;
const DAY_MS = 86400000;
const HOUR_MS = 3600000;
const MINUTE_MS = 60000;
const SECOND_MS = 1000;

const ABBREVIATION_BY_MS = {
    [MONTH_MS]: "month",
    [WEEK_MS]: "w",
    [DAY_MS]: "d",
    [HOUR_MS]: "h",
    [MINUTE_MS]: "m",
    [SECOND_MS]: "s"
};

class PrettyTime extends HTMLElement {

    static get properties() {
        return {
            milliseconds: {
                type: Number
            }
        };
    }

    static get observedAttributes() {
        return ["milliseconds"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this[name] = newValue;
        this.render();
    }

    render() {
        const milliseconds = parseInt(this.milliseconds);
        if (!isNaN(milliseconds)) {
            //TODO use MONTH_MS some day
            const prettyTime = prettyRender(milliseconds, WEEK_MS);
            this.innerText = prettyTime.trim();
        }
    }
}

function prettyRender(ms, currentMsMod, prettyTime = "") {
    const {value, remaining} = calcRemaining(ms, currentMsMod);
    if (value >= 1) prettyTime += " " + value + ABBREVIATION_BY_MS[currentMsMod];
    if (remaining < SECOND_MS)
        return prettyTime;
    else
        return prettyRender(remaining, nextMsMod(currentMsMod), prettyTime);
}

function nextMsMod(currentMsMod) {
    if (currentMsMod === MONTH_MS)
        return WEEK_MS;
    else if (currentMsMod === WEEK_MS)
        return DAY_MS;
    else if (currentMsMod === DAY_MS)
        return HOUR_MS;
    else if (currentMsMod === HOUR_MS)
        return MINUTE_MS;
    else if (currentMsMod === MINUTE_MS)
        return SECOND_MS;
}

function calcRemaining(ms, mod) {
    return {
        value: Math.trunc(ms / mod),
        remaining: ms % mod
    };
}

customElements.define("pretty-time", PrettyTime);