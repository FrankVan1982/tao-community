import http from 'k6/http';
import { check } from 'k6';
import { encodeUri } from '../../components/uri/encoder.js';
import { getTokens } from '../../components/security/csrf.js';

export function accessItemsMenu(params) {
    const res = http.request('GET', params.url + '/tao/Main/index?structure=items&ext=taoItems', '', {
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        cookies: params.user.cookie
    });

    const success1 = check(res, {
        'Access Items Menu - status is 200': r => r.status === 200,
    });

    const success2 = check(res, {
        'Access Items Menu - response body': r => r.body.indexOf('Create and design items and exercises') !== -1,
    });

    const success3 = check(res, {
        'Access Items Menu - response time ok': r => r.timings.duration < 2000
    });

    if (!success1) {
        params.errorRate.add(1);
    }

    if (!success2) {
        params.errorRate.add(1);
    }

    if (!success3) {
        params.errorRate.add(1);
    }

    return res;
}

/**
 * @param params
 *
 * @returns Item
 */
export function deleteItem(params) {
    const res = http.request(
        'POST',
        params.url + '/taoItems/Items/deleteItem',
        'uri=' +
            params.item.uri +
            '&id=' +
            params.item.uri +
            '&classUri=' +
            params.item.classUri +
            '&signature=' +
            params.tokens.signature,
        {
            redirects: 0,
            headers: {
                Accept: 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'X-CSRF-Token': params.tokens.csrfToken
            },
            cookies: params.user.cookie
        }
    );

    const success1 = check(res, {
        'Deleted item - status is 200': r => r.status === 200,
    });

    const success2 = check(res, {
        'Deleted item - response body': r => r.body.indexOf('"success":true') !== -1
    });

    if (!success1) {
        console.log('=======> Error' + res.status);
        params.errorRate.add(1);
    }

    if (!success2) {
        console.log('=======> Error' + JSON.stringify(res.body));
        params.errorRate.add(1);
    }

    return {
        tokens: getTokens(res),
        response: res
    };
}

export function selectItemOfTree(params) {
    const res = http.request(
        'POST',
        params.url + '/taoItems/Items/editItem',
        'uri=' +
            encodeUri(params.item.uri) +
            '&classUri=' +
            encodeUri(params.item.classUri) +
            '&id=' +
            encodeURIComponent(params.item.uri),
        {
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            cookies: params.user.cookie
        }
    );

    const success = check(res, { 'Select Item - status is 200': r => r.status === 200 });

    if (!success) {
        params.errorRate.add(1);
    }

    return {
        tokens: getTokens(res),
        response: res
    };
}

export function editItem(params) {
    const res = http.request(
        'POST',
        params.url + '/taoItems/Items/editItem',
        'form_1_sent=1&tao.forms.instance=1' +
            '&http_2_www_0_w3_0_org_1_2000_1_01_1_rdf-schema_3_label=' +
            params.item.label +
            '&id=' +
            params.item.uri +
            '&http_2_www_0_tao_0_lu_1_Ontologies_1_TAOItem_0_rdf_3_ItemModel=http_2_www_0_tao_0_lu_1_Ontologies_1_TAOItem_0_rdf_3_QTI' +
            '&classUri=' +
            encodeUri(params.item.classUri) +
            '&uri=' +
            encodeUri(params.item.uri) +
            '&Save=Save' +
            '&signature=' +
            params.tokens.signature +
            '&X-CSRF-Token=' +
            params.tokens.csrfToken,
        {
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            cookies: params.user.cookie
        }
    );

    const success = check(res, { 'Edit Item - status is 200': r => r.status === 200 });

    if (!success) {
        params.errorRate.add(1);
    }

    return {
        tokens: getTokens(res),
        response: res
    };
}
