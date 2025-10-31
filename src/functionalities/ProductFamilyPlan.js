
export const isApplyFamilyRate = (values) => {

  let isFamilyRate = false;  
  isFamilyRate =  values.insuredPersons.filter(f=>f.eligilbeIns !== 'STUDENT' && 
                                            (f.relationship === 'Primary' || f.relationship === 'Spouse'  || f.relationship === 'Child') && 
                                            f.age < (f.relationship === 'Child'? 22 : 60)  &&
                                            f.tripStartDate.toISOString().slice(0,10) === values.insuredPersons[0].tripStartDate.toISOString().slice(0,10) &&
                                            f.tripEndDate.toISOString().slice(0,10) === values.insuredPersons[0].tripEndDate.toISOString().slice(0,10) 
                                            ).length === values.insuredPersons.length

  return( isFamilyRate )
}


export const familyPlan = (values) => {

  const familyGroupInfo = [
    {companyName : 'Allianz',totalPremium : 0, familyPremium: 0, discountPremium: 0, inSort: 1, outSort: 2},
    {companyName : 'Tugo',totalPremium : 0, familyPremium: 0, discountPremium: 0, inSort: 2, outSort: 3},
    {companyName : 'BlueCross',totalPremium : 0, familyPremium: 0, discountPremium: 0, inSort: 3, outSort: 1},
    {companyName : 'Travelance',totalPremium : 0, familyPremium: 0, discountPremium: 0, inSort: 4, outSort: 4},
  ]

  
   //set totalPremium
    familyGroupInfo.map(i=>i.totalPremium = 0)                  
    // values.insuredPersons.map(p=>p.insurancePlans
    //     // .filter(f=>f.compnayName !== 'GMS')
    //     .filter(f=> values.insuredPersons[0].tripPeriod < 31 ? f.compnayName !== 'GMS' : f.compnayName !== 'GMS' && f.compnayName !== 'BlueCross')
    //     .map(ins=>(
    //         familyGroupInfo.filter(f=>f.companyName === ins.compnayName)[0].totalPremium += ins.insuranceAmount
    //     ))
    //   )
    values.insuredPersons.map(p=>p.insurancePlans
      .filter(f => {
        const eligibleIns = values.insuredPersons[0].eligilbeIns;
        const isWithin31Days = values.insuredPersons[0].tripPeriod < 31;
        // When Visitor, No Allianz
        return eligibleIns === 'CANADIAN'
          ? f.compnayName === 'Allianz' || f.compnayName === 'Tugo' || f.compnayName === 'BlueCross'
          : (eligibleIns !== 'CANADIAN' && f.compnayName !== 'Allianz') &&
            (isWithin31Days ? f.compnayName !== 'GMS' : f.compnayName !== 'GMS' && f.compnayName !== 'BlueCross');
        })  
      .map(ins=>(
          familyGroupInfo.filter(f=>f.companyName === ins.compnayName)[0].totalPremium += ins.insuranceAmount
      ))
    )


    // set familyPremium
    const birthDateArray = values.insuredPersons.map(i=>i.birthDate)

    let eldestBirthDate = new Date(Math.min(...birthDateArray))

    const eldest = values.insuredPersons.filter(f=>f.birthDate.toISOString().slice(0,10) === eldestBirthDate.toISOString().slice(0,10))[0].insurancePlans

    eldest.forEach(e => {
      if (e.compnayName === 'Allianz' || e.compnayName === 'Tugo' || e.compnayName === 'Travelance'){
        
        familyGroupInfo.filter(f=>f.companyName === e.compnayName)[0].familyPremium = e.insuranceAmount * 2 

        // Add the condition to set familyPremium to 20 if it's less than 20
        if (familyGroupInfo.filter(f => f.companyName === e.compnayName)[0].familyPremium < 20) {
          familyGroupInfo.filter(f => f.companyName === e.compnayName)[0].familyPremium = 20;
        }

      } else if (e.compnayName === 'BlueCross' ){
        
        // get 2nd insured insurance & insurance amount
        // const birthDate2ndArray = values.insuredPersons.filter(f=>f.birthDate.toISOString().slice(0,10) !== eldestBirthDate.toISOString().slice(0,10)).map(i=>i.birthDate)
        let birthDate2ndArray;
        if (values.insuredPersons.filter(f => f.birthDate.toISOString().slice(0, 10) === eldestBirthDate.toISOString().slice(0, 10)).length===2) {
          birthDate2ndArray = values.insuredPersons.filter(f => f.birthDate.toISOString().slice(0, 10) === eldestBirthDate.toISOString().slice(0, 10)).map(i => i.birthDate)
        } else {
          birthDate2ndArray = values.insuredPersons.filter(f => f.birthDate.toISOString().slice(0, 10) !== eldestBirthDate.toISOString().slice(0, 10)).map(i => i.birthDate)
        }

        let birthDate2nd = new Date(Math.min(...birthDate2ndArray))

        const insuraceAmount2nd = values.insuredPersons.filter(f=>f.birthDate.toISOString().slice(0,10) === birthDate2nd.toISOString().slice(0,10))[0]
                                            .insurancePlans.filter(f=>f.compnayName ==='BlueCross')[0].insuranceAmount - 11

        familyGroupInfo.filter(f=>f.companyName === e.compnayName)[0].familyPremium = e.insuranceAmount  + insuraceAmount2nd

        // Add the condition to set familyPremium to 20 if it's less than 20
        if (familyGroupInfo.filter(f => f.companyName === e.compnayName)[0].familyPremium < 25) {
          familyGroupInfo.filter(f => f.companyName === e.compnayName)[0].familyPremium = 25;
        }

      }
      
    });

    // set family discount
    familyGroupInfo.map(i => i.discountPremium = i.totalPremium - i.familyPremium) 

  return ( 
    familyGroupInfo
  )
}


