const OUTAGE_API_URL =
    'http://localhost:3003/api/outages';

const COMPONENT_API_URL =
    'http://localhost:3003/api/components';

const CAUSE_CODE_API_URL =
    'http://localhost:3003/api/cause-codes';


let editingOutageId = null;


const outageForm =
    document.getElementById('outageForm');


/*
 * Mesaj gösterme
 */

function showMessage(message, type) {
    const messageBox =
        document.getElementById('message');

    messageBox.textContent = message;

    messageBox.className = '';

    if (type === 'success') {

        messageBox.classList.add(
            'success-message'
        );

    } else {

        messageBox.classList.add(
            'error-message'
        );
    }


    setTimeout(() => {

        messageBox.textContent = '';

        messageBox.className = '';

    }, 3000);
}


/*
 * Kesintileri getir
 */

async function getOutages() {
    try {
        const response =
            await axios.get(
                OUTAGE_API_URL
            );

        const outages =
            response.data;

        const tableBody =
            document.getElementById(
                'outageTableBody'
            );


        tableBody.innerHTML = '';


        outages.forEach(outage => {

            tableBody.innerHTML += `
                <tr>

                    <td>
                        ${outage.id}
                    </td>

                    <td>
                        ${outage.started_at}
                    </td>

                    <td>
                        ${outage.description ?? '-'}
                    </td>

                    <td>
                        ${outage.type}
                    </td>

                    <td>
                        ${outage.component_name ?? '-'}
                    </td>

                    <td>
                        ${outage.cause_code ?? '-'}
                    </td>

                    <td>
                        ${outage.address_description ?? '-'}
                    </td>

                    <td>

                        <button
                            onclick="editOutage(${outage.id})"
                        >
                            Güncelle
                        </button>

                        <button
                            onclick="deleteOutage(${outage.id})"
                        >
                            Sil
                        </button>

                    </td>

                </tr>
            `;
        });

    } catch (error) {

        console.error(
            'Kesintiler alınamadı:',
            error
        );

        if (error.request) {

            showMessage(
                'Kesinti listesi alınamadı. Sunucuya ulaşılamıyor.',
                'error'
            );

        } else {

            showMessage(
                'Kesinti listesi alınırken hata oluştu.',
                'error'
            );
        }
    }
}


/*
 * Component dropdown
 */

async function loadComponents() {
    try {
        const response =
            await axios.get(
                COMPONENT_API_URL
            );

        const components =
            response.data;


        const componentSelect =
            document.getElementById(
                'component_id'
            );


        componentSelect.innerHTML = `
            <option value="">
                Şebeke unsuru seç
            </option>
        `;


        components.forEach(component => {

            componentSelect.innerHTML += `
                <option value="${component.id}">
                    ${component.name}
                    -
                    ${component.component_type}
                </option>
            `;
        });

    } catch (error) {

        console.error(
            'Component listesi alınamadı:',
            error
        );
    }
}


/*
 * Cause code dropdown
 */

async function loadCauseCodes() {
    try {
        const response =
            await axios.get(
                CAUSE_CODE_API_URL
            );

        const causeCodes =
            response.data;


        const causeSelect =
            document.getElementById(
                'cause_id'
            );


        causeSelect.innerHTML = `
            <option value="">
                Kesinti sebebi seç
            </option>
        `;


        causeCodes.forEach(cause => {

            causeSelect.innerHTML += `
                <option value="${cause.id}">
                    ${cause.code}
                    -
                    ${cause.description}
                </option>
            `;
        });

    } catch (error) {

        console.error(
            'Cause code listesi alınamadı:',
            error
        );
    }
}


/*
 * Form submit
 *
 * editingOutageId null ise POST
 * değer varsa PUT
 */

outageForm.addEventListener(
    'submit',
    async (event) => {

        event.preventDefault();


        const started_at =
            document.getElementById(
                'started_at'
            ).value;


        const description =
            document.getElementById(
                'description'
            ).value;


        const component_id =
            Number(
                document.getElementById(
                    'component_id'
                ).value
            );


        const type =
            document.getElementById(
                'type'
            ).value;


        const address_description =
            document.getElementById(
                'address_description'
            ).value;


        const causeValue =
            document.getElementById(
                'cause_id'
            ).value;


        const cause_id =
            causeValue
                ? Number(causeValue)
                : null;


        const newOutage = {
            started_at,
            ended_at: null,
            description,
            component_id,
            type,
            address_description,
            cause_id
        };


        try {

            /*
             * Yeni kayıt
             */

            if (editingOutageId === null) {

                await axios.post(
                    OUTAGE_API_URL,
                    newOutage
                );


                showMessage(
                    'Kesinti başarıyla eklendi',
                    'success'
                );


                /*
                 * Güncelleme
                 */

            } else {

                await axios.put(
                    `${OUTAGE_API_URL}/${editingOutageId}`,
                    newOutage
                );


                showMessage(
                    'Kesinti başarıyla güncellendi',
                    'success'
                );
            }


            /*
             * Formu tekrar ekleme moduna getir
             */

            editingOutageId = null;


            outageForm.reset();


            document.getElementById(
                'submitButton'
            ).textContent =
                'Kesinti Ekle';


            /*
             * Listeyi yeniden getir
             */

            await getOutages();


        } catch (error) {

            console.error(
                'İşlem başarısız:',
                error
            );


            /*
             * Backend cevap verdi
             * fakat 400 / 404 / 500 döndü.
             */

            if (error.response) {

                showMessage(
                    error.response.data.message
                    ||
                    'Backend hatası oluştu',
                    'error'
                );


                /*
                 * HTTP isteği gönderildi
                 * ama cevap alınamadı.
                 */

            } else if (error.request) {

                showMessage(
                    'Sunucuya bağlanılamadı',
                    'error'
                );


                /*
                 * Frontend JavaScript hatası
                 */

            } else {

                showMessage(
                    'Frontend tarafında bir hata oluştu',
                    'error'
                );
            }
        }
    }
);


/*
 * Güncelleme için mevcut kaydı getir
 */

async function editOutage(id) {
    try {
        const response =
            await axios.get(
                `${OUTAGE_API_URL}/${id}`
            );


        const outage =
            response.data;


        editingOutageId =
            outage.id;


        document.getElementById(
            'started_at'
        ).value =
            outage.started_at
                ? outage.started_at.slice(0, 16)
                : '';


        document.getElementById(
            'description'
        ).value =
            outage.description ?? '';


        document.getElementById(
            'component_id'
        ).value =
            outage.component_id;


        document.getElementById(
            'type'
        ).value =
            outage.type;


        document.getElementById(
            'address_description'
        ).value =
            outage.address_description ?? '';


        document.getElementById(
            'cause_id'
        ).value =
            outage.cause_id ?? '';


        document.getElementById(
            'submitButton'
        ).textContent =
            'Kesintiyi Güncelle';


        /*
         * Kullanıcı formu görsün.
         */

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });


    } catch (error) {

        console.error(
            'Kesinti bilgisi alınamadı:',
            error
        );


        showMessage(
            'Kesinti bilgisi alınamadı',
            'error'
        );
    }
}


/*
 * Kesinti sil
 */

async function deleteOutage(id) {

    const confirmDelete =
        confirm(
            'Bu kesintiyi silmek istediğinize emin misiniz?'
        );


    if (!confirmDelete) {
        return;
    }


    try {

        await axios.delete(
            `${OUTAGE_API_URL}/${id}`
        );


        showMessage(
            'Kesinti başarıyla silindi',
            'success'
        );


        await getOutages();


    } catch (error) {

        console.error(
            'Kesinti silinemedi:',
            error
        );


        if (error.response) {

            showMessage(
                error.response.data.message
                ||
                'Kesinti silinemedi',
                'error'
            );

        } else if (error.request) {

            showMessage(
                'Sunucuya bağlanılamadı',
                'error'
            );

        } else {

            showMessage(
                'Silme sırasında frontend hatası oluştu',
                'error'
            );
        }
    }
}


/*
 * Sayfa ilk açıldığında
 */

getOutages();

loadComponents();

loadCauseCodes();