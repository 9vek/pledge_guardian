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
fn update(pledge: Pledge) -> PledgeWithId {
    let identity = ic_cdk::api::caller();
    let pledge_with_id = PledgeWithId { 
        identity, 
        description: pledge.description, 
        display_name: pledge.display_name, 
        time: time().to_string()
    };
    PLEDGE_SET.with(|pledge_set| {
        pledge_set.borrow_mut().push(pledge_with_id.clone());
    });
    pledge_with_id
}

// get record related to current principal
#[query(name = "get_pledge_list")]
fn get_pledge_list(start: u64, size: u64) -> Vec<PledgeWithId> {
    let start = start as usize;
    let mut size = size as usize;
    PLEDGE_SET.with(|pledge_set| {
        let pledge_list = pledge_set.borrow();
        let limit = pledge_list.len();

        if limit == 0 || size == 0 { return vec![] }
        if start > limit { return vec![] }
        if start + size > limit { size = limit - start; }
        pledge_list[start..start+size].to_vec()
    })
}
