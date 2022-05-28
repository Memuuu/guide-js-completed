
class Kisi {
    constructor(ad, soyad, mail) {
        this.ad = ad;
        this.soyad = soyad;
        this.mail = mail;
    }
}

class Util {
    //kontroller için
    static bosAlanKontrolEt(...alanlar) {
        let sonuc = true;
        alanlar.forEach(alan => {
            if (alan.length === 0) {
                sonuc = false;
                return false;
            }
        });

        return sonuc;
    }

    

}
class Ekran {
    constructor() {
        this.ad = document.getElementById('ad');
        this.soyad = document.getElementById('soyad');
        this.mail = document.getElementById('mail');
        this.ekleGuncelleButon = document.querySelector('.kaydetGuncelle');
        this.form = document.getElementById('form-rehber');
        this.form.addEventListener('submit', this.kaydetGuncelle.bind(this));
        this.kisiListesi = document.querySelector('.kisi-listesi');
        this.kisiListesi.addEventListener('click', this.guncelleVeyaSil.bind(this));
        this.depo = new Depo();
        //uptade ve delete butanlarına basıldıgında ilgili tr elementi burda tutulur
        this.secilenSatir = undefined;
        this.kisileriEkranaYazdir();

    }
    

    bilgiOlustur(mesaj, durum) {

        const uyariDivi = document.querySelector('.bilgi');

        uyariDivi.textContent = mesaj;

        /*if(durum){
            olusturulanBilgi.classList.add('bilgi--success');
        }else{
            olusturulanBilgi.classList.add('bilgi--error');
        }*/

        uyariDivi.classList.add(durum ? 'bilgi--success' : 'bilgi--error');
        //document.querySelector('.container').insertBefore(olusturulanBilgi, this.form);

        //setTimeOut, setInterval
        setTimeout(function () {
            uyariDivi.className = 'bilgi';
        }, 2000);

    }

    alanlariTemizle() {
        this.ad.value = '';
        this.soyad.value = '';
        this.mail.value = '';
    }

    guncelleVeyaSil(e) {
        const tiklanmaYeri = e.target;
        if (tiklanmaYeri.classList.contains('fa-trash-can')) {
            this.secilenSatir = tiklanmaYeri.parentElement.parentElement.parentElement;
            this.kisiyiEkrandanSil();

        } else if (tiklanmaYeri.classList.contains('fa-edit')) {
            this.secilenSatir = tiklanmaYeri.parentElement.parentElement.parentElement;
            this.ekleGuncelleButon.value = 'Güncelle';
            this.ad.value = this.secilenSatir.cells[0].textContent;
            this.soyad.value = this.secilenSatir.cells[1].textContent;
            this.mail.value = this.secilenSatir.cells[2].textContent;

        }
    }

    kisiyiEkrandaGuncelle(kisi) {

        this.depo.kisiGuncelle(kisi, this.secilenSatir.cells[2].textContent);

        this.secilenSatir.cells[0].textContent = kisi.ad;
        this.secilenSatir.cells[1].textContent = kisi.soyad;
        this.secilenSatir.cells[2].textContent = kisi.mail;

        this.alanlariTemizle();
        this.secilenSatir = undefined;
        this.ekleGuncelleButon.value = 'Kaydet';
        this.bilgiOlustur('Kişi güncellendi', true);

    }

    kisiyiEkrandanSil() {
        this.secilenSatir.remove();
        const silinecekMail = this.secilenSatir.cells[2].textContent;
        this.depo.kisiSil(silinecekMail);
        this.alanlariTemizle();
        this.secilenSatir = undefined;
        this.bilgiOlustur('Kişi rehberden silindi', true);
    }

    kisileriEkranaYazdir() {
        this.depo.tumKisiler.forEach(kisi => {
            this.kisiyiEkranaEkle(kisi);
        });
    }

    kisiyiEkranaEkle(kisi) {
        const olusturulanTR = document.createElement('tr');
        olusturulanTR.innerHTML = `<td>${kisi.ad}</td>
        <td>${kisi.soyad}</td>
        <td>${kisi.mail}</td>
        <td>
            <button class="btn btn--edit"><i class="fa-solid fa-edit"></i></button>
            <button class="btn btn--delete"><i class="fa-solid fa-trash-can"></i></button>
        </td>`;

        this.kisiListesi.appendChild(olusturulanTR);

    }

    kaydetGuncelle(e) {
        e.preventDefault();
        const kisi = new Kisi(this.ad.value, this.soyad.value, this.mail.value);
        const sonuc = Util.bosAlanKontrolEt(kisi.ad, kisi.soyad, kisi.mail);

        //tüm alanlar doldurulmuş
        if (sonuc) {

            if (this.secilenSatir) {
                //secilen satır undefined değilse güncellenecek demektir
                this.kisiyiEkrandaGuncelle(kisi);
            } else {
                //secilen satır undefined ise ekleme yapılacak demektir
                //yeni kisi ekrana ekler
                this.bilgiOlustur('Başarıyla Eklendi', true);
                this.kisiyiEkranaEkle(kisi);
                //localStorage ekle
                this.depo.kisiEkle(kisi);
            }

            this.alanlariTemizle();
        } else {
            this.bilgiOlustur('Boş alanları doldurunuz', false);
        }
    }
}

class Depo {
    //uygulama ilk açıldıgında veriler getirilir.

    constructor() {
        this.tumKisiler = this.kisileriGetir();
    }
    kisileriGetir() {
        let tumKisilerLocal = [];
        if (localStorage.getItem('tumKisiler') === null) {
            tumKisilerLocal = [];
        } else {
            tumKisilerLocal = JSON.parse(localStorage.getItem('tumKisiler'))
        }
        return tumKisilerLocal;
    }
    kisiEkle(kisi) {
        this.tumKisiler.push(kisi);
        localStorage.setItem('tumKisiler', JSON.stringify(this.tumKisiler));
    }
    kisiSil(mail) {
        this.tumKisiler.forEach((kisi, index) => {
            if (kisi.mail === mail) {
                this.tumKisiler.splice(index, 1);
            }
        });
        localStorage.setItem('tumKisiler', JSON.stringify(this.tumKisiler));
    }
    kisiGuncelle(guncellenmisKisi, mail) {
        this.tumKisiler.forEach((kisi, index) => {
            if (kisi.mail === mail) {
                this.tumKisiler[index] = guncellenmisKisi;
            }
        });
        localStorage.setItem('tumKisiler', JSON.stringify(this.tumKisiler));
    }
}

document.addEventListener('DOMContentLoaded', function (e) {
    const ekran = new Ekran();
});