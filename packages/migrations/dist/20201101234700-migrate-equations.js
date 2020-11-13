module.exports =
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 636:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "__extends": () => /* binding */ __extends,
/* harmony export */   "__assign": () => /* binding */ __assign,
/* harmony export */   "__rest": () => /* binding */ __rest,
/* harmony export */   "__decorate": () => /* binding */ __decorate,
/* harmony export */   "__param": () => /* binding */ __param,
/* harmony export */   "__metadata": () => /* binding */ __metadata,
/* harmony export */   "__awaiter": () => /* binding */ __awaiter,
/* harmony export */   "__generator": () => /* binding */ __generator,
/* harmony export */   "__createBinding": () => /* binding */ __createBinding,
/* harmony export */   "__exportStar": () => /* binding */ __exportStar,
/* harmony export */   "__values": () => /* binding */ __values,
/* harmony export */   "__read": () => /* binding */ __read,
/* harmony export */   "__spread": () => /* binding */ __spread,
/* harmony export */   "__spreadArrays": () => /* binding */ __spreadArrays,
/* harmony export */   "__await": () => /* binding */ __await,
/* harmony export */   "__asyncGenerator": () => /* binding */ __asyncGenerator,
/* harmony export */   "__asyncDelegator": () => /* binding */ __asyncDelegator,
/* harmony export */   "__asyncValues": () => /* binding */ __asyncValues,
/* harmony export */   "__makeTemplateObject": () => /* binding */ __makeTemplateObject,
/* harmony export */   "__importStar": () => /* binding */ __importStar,
/* harmony export */   "__importDefault": () => /* binding */ __importDefault,
/* harmony export */   "__classPrivateFieldGet": () => /* binding */ __classPrivateFieldGet,
/* harmony export */   "__classPrivateFieldSet": () => /* binding */ __classPrivateFieldSet
/* harmony export */ });
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    }
    return __assign.apply(this, arguments);
}

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var __createBinding = Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});

function __exportStar(m, o) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};

var __setModuleDefault = Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
};

function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
}

function __importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}

function __classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
}

function __classPrivateFieldSet(receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
}


/***/ }),

/***/ 563:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.migrateEquationsState = void 0;
const tslib_1 = __webpack_require__(636);
/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2020 Serlo Education e.V.
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
 * @copyright Copyright (c) 2013-2020 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */
const utils_1 = __webpack_require__(252);
/**
 * Migrates the Edtr.io states of all equations plugins to the new format.
 * THIS IS AN IRREVERSIBLE MIGRATION!
 */
utils_1.createMigration(exports, {
    up: (db) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        function processResults(results) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                if (results.length === 0)
                    return;
                const [field, ...remainingResults] = results;
                const state = JSON.parse(field.value);
                const newState = JSON.stringify(migrateState(state));
                if (field.value !== newState) {
                    yield db.runSql(`UPDATE entity_revision_field SET value = ? WHERE id = ?`, newState, field.id);
                    console.log('Updated revision', field.revision);
                }
                yield processResults(remainingResults);
            });
        }
        const results = yield db.runSql(`
      SELECT erf.id, erf.value, er.id as revision
      FROM entity_revision_field erf
        LEFT JOIN entity_revision er on erf.entity_revision_id = er.id
        LEFT JOIN entity e on er.repository_id = e.id
      WHERE erf.field = 'content'
        AND erf.value LIKE '%{"plugin":"equations"%'
    `);
        yield processResults(results);
    }),
});
function migrateState(document) {
    switch (document.plugin) {
        case 'equations':
            return migrateEquationsState(document.state);
        // Layout plugins
        case 'blockquote':
            return Object.assign(Object.assign({}, document), { state: migrateState(document.state) });
        case 'exercise':
            return Object.assign(Object.assign({}, document), { state: Object.assign(Object.assign({}, document.state), { content: migrateState(document.state.content), interactive: document.state.interactive
                        ? migrateState(document.state.interactive)
                        : undefined }) });
        case 'important':
            return Object.assign(Object.assign({}, document), { state: migrateState(document.state) });
        case 'inputExercise':
            return Object.assign(Object.assign({}, document), { state: Object.assign(Object.assign({}, document.state), { answers: document.state.answers.map((answer) => {
                        return Object.assign(Object.assign({}, answer), { feedback: migrateState(answer.feedback) });
                    }) }) });
        case 'layout':
            return Object.assign(Object.assign({}, document), { state: document.state.map((row) => {
                    return Object.assign(Object.assign({}, row), { child: migrateState(row.child) });
                }) });
        case 'multimedia':
            return Object.assign(Object.assign({}, document), { state: Object.assign(Object.assign({}, document.state), { explanation: migrateState(document.state.explanation), multimedia: migrateState(document.state.multimedia) }) });
        case 'rows':
            return Object.assign(Object.assign({}, document), { state: document.state.map((row) => {
                    return migrateState(row);
                }) });
        case 'scMcExercise':
            return Object.assign(Object.assign({}, document), { state: Object.assign(Object.assign({}, document.state), { answers: document.state.answers.map((answer) => {
                        return Object.assign(Object.assign({}, answer), { content: migrateState(answer.content), feedback: migrateState(answer.feedback) });
                    }) }) });
        case 'spoiler':
            return Object.assign(Object.assign({}, document), { state: Object.assign(Object.assign({}, document.state), { content: migrateState(document.state.content) }) });
        case 'solution':
            return Object.assign(Object.assign({}, document), { state: Object.assign(Object.assign({}, document.state), { strategy: migrateState(document.state.strategy), steps: migrateState(document.state.steps) }) });
        // Content plugins
        case 'anchor':
        case 'deprecated':
        case 'error':
        case 'geogebra':
        case 'highlight':
        case 'image':
        case 'injection':
        case 'separator':
        case 'table':
        case 'text':
        case 'video':
            return document;
        default:
            throw new Error('Unexpected plugin');
    }
}
function migrateEquationsState(state) {
    try {
        return {
            plugin: 'equations',
            state: {
                steps: state.steps.map((step) => {
                    const { left, sign, right, transform } = step;
                    return Object.assign({ left: extractSingleFormulaFromText(left), sign: sign, right: extractSingleFormulaFromText(right) }, extractTransformOrExplanationFromText(transform));
                }),
            },
        };
    }
    catch (e) {
        console.log('Failed to', e.message);
        return {
            plugin: 'deprecated',
            state: {
                plugin: 'equations',
                state,
            },
        };
    }
}
exports.migrateEquationsState = migrateEquationsState;
function extractSingleFormulaFromText(textState) {
    const paragraphs = textState.state.filter((paragraph) => {
        return (paragraph.type === 'p' && getCleanChildren(paragraph.children).length > 0);
    });
    if (paragraphs.length === 0)
        return '';
    if (paragraphs.length !== 1) {
        throw new Error('text has more than one paragraph');
    }
    const paragraph = paragraphs[0];
    if (paragraph.type !== 'p') {
        throw new Error('text has block that is not a paragraph');
    }
    const children = getCleanChildren(paragraph.children);
    if (children.length === 0)
        return '';
    return children
        .map((child) => {
        if (child.type === 'math') {
            return children[0].src;
        }
        else if (child.text) {
            return child.text;
        }
        else {
            throw new Error('text contains unexpected child');
        }
    })
        .join('');
}
function extractTransformOrExplanationFromText(textState) {
    if (textState.state.length !== 1)
        return noTransform();
    const paragraph = textState.state[0];
    if (paragraph.type !== 'p')
        return noTransform();
    const cleanChildren = getCleanChildren(paragraph.children);
    if (cleanChildren.length === 1 && cleanChildren[0].type === 'math') {
        const src = cleanChildren[0].src;
        if (src.startsWith('|') || src.startsWith('\\vert')) {
            return transform(src.replace(/^(\||\\vert)(\\:)*/, '').trim());
        }
        if (src.startsWith('\\left|')) {
            return transform(src
                .replace(/^\\left\|/, '')
                .replace(/\\right\.$/, '')
                .trim());
        }
    }
    return noTransform();
    function noTransform() {
        return {
            transform: '',
            explanation: textState,
        };
    }
    function transform(src) {
        return {
            transform: src,
            explanation: {
                plugin: 'text',
            },
        };
    }
}
function getCleanChildren(children) {
    return children.filter((child) => {
        return (Object.keys(child).length !== 0 &&
            child['text'] !== '' &&
            child['text'] !== ' ');
    });
}


/***/ }),

/***/ 771:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.clearDeadUuids = void 0;
const tslib_1 = __webpack_require__(636);
function clearDeadUuids(db) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield db.runSql(`
    DELETE FROM uuid
      WHERE discriminator = 'taxonomyTerm'
      AND (SELECT count(*) FROM term_taxonomy WHERE term_taxonomy.id = uuid.id) = 0
  `);
        yield db.runSql(`
    DELETE FROM uuid
      WHERE discriminator = 'user'
      AND (SELECT count(*) FROM user WHERE user.id = uuid.id) = 0
  `);
        yield db.runSql(`
    DELETE FROM uuid
      WHERE discriminator = 'attachment'
      AND (SELECT count(*) FROM attachment_container WHERE attachment_container.id = uuid.id) = 0
  `);
        yield db.runSql(`
    DELETE FROM uuid
      WHERE discriminator = 'entity'
      AND (SELECT count(*) FROM entity WHERE entity.id = uuid.id) = 0
  `);
        yield db.runSql(`
    DELETE FROM uuid
      WHERE discriminator = 'entityRevision'
      AND (SELECT count(*) FROM entity_revision WHERE entity_revision.id = uuid.id) = 0
  `);
        yield db.runSql(`
    DELETE FROM uuid
      WHERE discriminator = 'page'
      AND (SELECT count(*) FROM page_repository WHERE page_repository.id = uuid.id) = 0
  `);
        yield db.runSql(`
    DELETE FROM uuid
      WHERE discriminator = 'pageRevision'
      AND (SELECT count(*) FROM page_revision WHERE page_revision.id = uuid.id) = 0
  `);
        yield db.runSql(`
    DELETE FROM uuid
      WHERE discriminator = 'comment'
      AND (SELECT count(*) FROM comment WHERE comment.id = uuid.id) = 0
  `);
        yield db.runSql(`
    DELETE FROM event_log WHERE EXISTS (
      SELECT ep.id FROM event_parameter ep
        WHERE ep.log_id = event_log.id
        AND NOT EXISTS (SELECT id FROM event_parameter_string eps WHERE eps.event_parameter_id = ep.id)
        AND NOT EXISTS (SELECT id FROM event_parameter_uuid epu WHERE epu.event_parameter_id = ep.id)
    )
  `);
    });
}
exports.clearDeadUuids = clearDeadUuids;


/***/ }),

/***/ 66:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createMigration = void 0;
/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2020 Serlo Education e.V.
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
 * @copyright Copyright (c) 2013-2020 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */
const database_1 = __webpack_require__(879);
function createMigration(exports, { up, down, }) {
    exports._meta = {
        version: 1,
    };
    exports.up = (db, cb) => {
        up(database_1.createDatabase(db))
            .then(() => {
            cb(undefined);
        })
            .catch((error) => {
            cb(error);
        });
    };
    exports.down = (db, cb) => {
        if (typeof down === 'function') {
            down(database_1.createDatabase(db))
                .then(() => {
                cb();
            })
                .catch((error) => {
                cb(error);
            });
        }
        else {
            cb();
        }
    };
}
exports.createMigration = createMigration;


/***/ }),

/***/ 879:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createDatabase = void 0;
const tslib_1 = __webpack_require__(636);
/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2020 Serlo Education e.V.
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
 * @copyright Copyright (c) 2013-2020 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */
function createDatabase(db) {
    return {
        runSql: (query, ...params) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                db.runSql(query, ...params, (error, results) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve(results);
                });
            });
        }),
        dropTable: (table) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                db.dropTable(table, (error) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve();
                });
            });
        }),
    };
}
exports.createDatabase = createDatabase;


/***/ }),

/***/ 252:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(636);
/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2020 Serlo Education e.V.
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
 * @copyright Copyright (c) 2013-2020 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */
tslib_1.__exportStar(__webpack_require__(771), exports);
tslib_1.__exportStar(__webpack_require__(66), exports);
tslib_1.__exportStar(__webpack_require__(879), exports);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	__webpack_require__.ab = __dirname + "/";/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(563);
/******/ })()
;