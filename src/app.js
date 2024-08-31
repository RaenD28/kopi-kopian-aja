// memanggil alpine js
document.addEventListener("alpine:init", () => {
  // membuat data pada alpine dengan nama products yang nantinya akan dipanggil di HTML
  Alpine.data("products", () => ({
    // membuat data array dengan nama items
    items: [
      { id: 1, name: "Coffee Beans Can", img: "products1.png", price: 35000 },
      {
        id: 2,
        name: "Coffee Beans Little Nap",
        img: "products2.jpg",
        price: 30000,
      },
      {
        id: 3,
        name: "Coffee Beans Premium Kopian",
        img: "products3.jpg",
        price: 40000,
      },
      { id: 4, name: "Le Cafe", img: "products4.jpg", price: 20000 },
      {
        id: 5,
        name: "Toscana Coffee Beans",
        img: "products5.png",
        price: 35000,
      },
      {
        id: 6,
        name: "Earlybird Coffee Beans",
        img: "products6.jpg",
        price: 30000,
      },
    ],
  }));

  // state management global pada alpine untuk store data ke shopping cart
  Alpine.store("cart", {
    items: [],
    total: 0,
    quantity: 0,

    // fungsi untuk menambah item belanjaan
    add(newItem) {
      // cek apakah ada barang yang sama dalam cart
      const cartItem = this.items.find((item) => item.id === newItem.id);

      // jika BELUM ADA BARANG atau cart nya masih kosong
      if (!cartItem) {
        this.items.push({ ...newItem, quantity: 1, total: newItem.price }); // memasukan add(newItem) ke dalam array items, sekaligus nambahkan component baru
        this.quantity++;
        this.total += newItem.price;
        console.log(this.total); // ditampilkan melalui console
      }

      // jika SUDAH ADA BARANG, dicek apakah ada yang sama dengan yang ada di cart
      else {
        this.items = this.items.map((item) => {
          // .map() digunakan untuk callback

          // jika barang berbeda
          if (item.id !== newItem.id) {
            return item;
          }

          // jika barang sama
          else {
            // tambah quantity dan sub-total
            item.quantity++;
            item.total = item.price * item.quantity;
            this.quantity++;
            this.total += item.price;
            return item;
          }
        });
      }
    },

    // fungsi untuk mengurangi item belanjaan
    remove(id) {
      // ambil item yang mau diremove berdasarkan id nya
      const cartItem = this.items.find((item) => item.id === id);

      // jika item lebih dari 1
      if (cartItem.quantity > 1) {
        // telusuri satu persatu
        this.items = this.items.map((item) => {
          // jika bukan barang yang di klik
          if (item.id !== id) {
            return item;
          } else {
            item.quantity--;
            item.total = item.price * item.quantity;
            this.quanitty--;
            this.total -= item.price;
            return item;
          }
        });
      } else if (cartItem.quantity === 1) {
        // jika barang sisa 1
        this.items = this.items.filter((item) => item.id !== id);
        this.quantity--;
        this.total -= cartItem.price;
      }
    },
  });
});

// Form Validation
const checkoutButton = document.querySelector(".checkout-button");
checkoutButton.disabled = true;

const form = document.querySelector("#checkout-form");

form.addEventListener("keyup", function () {
  for (let i = 0; i < form.elements.length; i++) {
    // pengulangan untuk mengecek satu persatu form nya sudah terisi atau belum (kondisi masih disabled)
    if (form.elements[i].value.length !== 0) {
      checkoutButton.classList.remove("disabled");
      checkoutButton.classList.add("disabled");
    } else {
      return false;
    }
  }

  // untuk enalble supaya tombol checkout bisa diklik
  checkoutButton.disabled = false;
  checkoutButton.classList.remove("disabled");
});

// kirim data ketika tombol checkout di klik
checkoutButton.addEventListener("click", function (e) {
  e.preventDefault();
  const formData = new FormData(form);
  const data = new URLSearchParams(formData);
  const objData = Object.fromEntries(data);
  const message = formatMessage(objData);
  window.open("http://wa.me/6287855541636?text=" + encodeURIComponent(message));
});

// format pesan WHATSAPP
const formatMessage = (obj) => {
  // Mengonversi string JSON ke array objek
  const items = JSON.parse(obj.items);

  // Membuat pesan dengan penomoran untuk setiap item
  const itemDetails = items
    .map((item, index) => {
      return `${index + 1}. ${item.name} (${item.quantity} x ${rupiah(
        item.total
      )})`;
    })
    .join("\n"); // Gabungkan item-item dengan newline

  return `Halo kakk, saya ingin pesan kopi ;)
Data Pesanan
${itemDetails}

TOTAL: ${rupiah(obj.total)}
Terima kasih :)`;
};

// konversi ke rupiah
const rupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};
