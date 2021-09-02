(() => {

  const createVueApp = function () {
    const app = Vue.createApp({
      data() {
        return {
          day: ['日', '月', '火', '水', '木', '金', '土'],
          name: null,
          year: new Date().getFullYear(),
          month: new Date().getMonth() + 1,
          job: {
            0: {
              name: null,
              money: null
            }
          },
          date: {},
          money: 0,
          message: '今月もよくがんばりました！'
        }
      },
      mounted: function () {
        this.createDate();
      },
      methods: {
        next(index) {
          let section = $('section')[index + 1];
          $('html, body').animate({
            scrollTop: $(section).offset().top,
            duration: 'slow'
          });
        },
        back(index) {
          let section = $('section')[index - 1];
          $('html, body').animate({
            scrollTop: $(section).offset().top,
            duration: 'slow'
          });
        },
        addJob() {
          let arr = Object.keys(this.job);
          let id = Number(arr[arr.length - 1]) + 1;
          this.job[id] = ({
            name: null,
            money: null
          });
        },
        deleteJob(key) {
          delete this.job[key]
          this.date.forEach(d => {
            d.shift.forEach((s, i) => {
              if (s.id == key) d.shift.splice(i, 1);
            });
          });
        },
        getJobName(id) {
          return this.job[id].name;
        },
        getJobHTML() {
          let jobs = Object.keys(this.job).filter(key => this.job[key].name != null && this.job[key].money != null);
          let dom = '';
          jobs.forEach(key => {
            let job = this.job[key];
            dom += `<option value="${key}">${job.name}</option>\n`
          });
          return dom;
        },
        async addShift(date) {
          const {
            value: formValues
          } = await Swal.fire({
            title: `${date}日のシフトを登録`,
            html: '<select id="input-name" class= "swal2-input">' +
              this.getJobHTML() +
              '<select></select>' +
              '<input type="number" placeholder="稼働時間" min="0" id="input-time" class="swal2-input">時間',
            focusConfirm: false,
            preConfirm: () => {
              let id = $('#input-name').val();
              let time = $('#input-time').val();
              if (id == null || time == null) return false;
              return {
                id: id,
                time: time
              }
            }
          });

          if (formValues) {
            this.date[date].shift.push(formValues);
          }
        },
        deleteShift(date, index) {
          this.date[date].shift.splice(index, 1);
        },
        createDate() {
          if (!this.year || !this.month) return;
          let last = new Date(this.year, this.month, 0).getDate();
          let date = {};
          for (i = 1; i <= last; i++) {
            date[i] = {
              date: i,
              shift: []
            }
          }
          this.date = date;
        },
        space() {
          const date = new Date(this.year, this.month - 1, 1);
          return new Array(date.getDay());
        },
        sum() {
          let money = 0;
          if (!this.date) return money;
          Object.values(this.date).forEach(d => {
            d.shift.forEach(s => {
              let job = this.job[s.id];
              if (job) money += job.money * s.time;
            });
          });
          this.money = money;
          return money.toLocaleString();
        }
      },
      watch: {
        year: function (n, o) {
          this.createDate();
        },
        month: function (n, o) {
          this.createDate();
        },
        money: function (n, o) {
          if (n >= 100000) {
            this.message = '働きすぎだよ！';
          } else if (n >= 50000) {
            this.message = 'たくさん稼いだね！';
          } else {
            this.message = '今月もよくがんばりました！'
          }
        }
      }
    }).mount('body');
  }

  const main = function () {
    $(window).on('load', () => {
      createVueApp();
    });
  }

  // main function
  main();

})();
