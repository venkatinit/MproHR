export interface deposit{
    sl_no:number,
    
      due_date_from:any,
      due_date_to:any,
      no_of_installments:number,
      amount:number,
      late_fine:number,
      date_of_renew:any,
      mr_no:number,
      deposit_branch:string
  
  }
  export const depositentry=[
      {
        sl_no:1,
        due_date_from:'13/12/2022',
        due_date_to:'',
        no_of_installments:1,
        amount:100,
        late_fine:0,
        date_of_renew:'13/12/2022',
        mr_no:0,
        deposit_branch:'TENALI'
    },
    {
        sl_no:2,
        due_date_from:'14/12/2022',
        due_date_to:'16/12/2022',
        no_of_installments:3,
        amount:300,
        late_fine:0,
        date_of_renew:'13/12/2022',
        mr_no:7471,
        deposit_branch:'TENALI'
    },

    ];