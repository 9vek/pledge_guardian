use ic_cdk::{
    api::time,
    export::{
        candid::{CandidType, Deserialize},
        Principal,
    },
};
use ic_cdk_macros::*;
use std::cell::RefCell;

// data structures
type PledgeSet = Vec<PledgeWithId>;

#[derive(Clone, Debug, CandidType, Deserialize)]
struct Pledge {
    pub description: String,
    pub display_name: String,
}

#[derive(Clone, Debug, CandidType, Deserialize)]
struct PledgeWithId {
    pub identity: Principal,
    pub description: String,
    pub display_name: String,
    pub time: String
}

// initialize memory pieces using RefCell
thread_local! {
static PLEDGE_SET: RefCell<PledgeSet> = RefCell::default();
}

// update records
#[update]
fn update(pledge: Pledge) {
    let identity = ic_cdk::api::caller();
    let pledge_with_id = PledgeWithId { 
        identity, 
        description: pledge.description, 
        display_name: pledge.display_name, 
        time: time().to_string()
    };
    PLEDGE_SET.with(|pledge_set| {
        pledge_set.borrow_mut().push(pledge_with_id);
    });
}

// get record related to current principal
#[query(name = "get_all")]
fn get_all() -> Vec<PledgeWithId> {
    let mut pledges: Vec<PledgeWithId> = vec![];
    PLEDGE_SET.with(|pledge_set| {
        pledges = pledge_set
            .borrow()
            .clone();
    });
    pledges
}
