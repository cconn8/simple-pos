const data = {
    categories : [{
        name: 'information',
        type : [{
                name: 'deceased_details',
                fields : [{
                        name: '',
                        date_of_death: '',
                    }
                ]
            },
            {
                name: 'client_details',
                fields : [{
                    name: '',
                    billing_address: '',
                    phone: '',
                    email: ''
                }
            ]
            }
        ]
    },
    {
        name: 'product',
        type : [{
                name: 'coffins'
            }
        ]
    },
    {
        name: 'service',
        type : [{
                name: 'service_fees'
            },
            {
                name: 'embalming'
            },
            {
                name: 'booklets'
            }
        ]
    },
    {
        name: 'disbursement',
        type : [{
                name: 'flowers'
            },
            {
                name: 'music'
            }
        ]
    },
    {
        name: 'event',
        type : [{
                name: 'collection'
            },
            {
                name: 'funeral_mass'
            },
            {
                name: 'reposing'
            }
        ]
    }]
}