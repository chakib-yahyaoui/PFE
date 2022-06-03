({
    loadMap : function(component,event,helper,account) {
        var mapsArray = [];
        for(let index=0; index < account.length; index++){
            
            var Mobj = {
                location: {
                    Street: account[index].BillingStreet,
                    City: account[index].BillingCity,
                    PostalCode: account[index].BillingPostalCode,
                    State: account[index].BillingState,
                    Country: account[index].BillingCountry
                },
                icon: 'standard:account',
                title: account[index].Name,
                description: account[index].Website
            }
            mapsArray.push(Mobj);
        }
        component.set('v.mapMarkers', mapsArray);
        component.set('v.centerObj', {
            location: {
                City: 'Noida'
            }
        });
        component.set('v.zoomLevel', 12);
        component.set('v.markersTitle', 'Accounts locations');
        component.set('v.showFooter', true);
    }
})