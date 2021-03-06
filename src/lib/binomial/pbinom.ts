/*
 *  AUTHOR
 *  Jacob Bogers, jkfbogers@gmail.com
 *  March 14, 2017
 * 
 *  ORIGNINAL AUTHOR
 *  Mathlib : A C Library of Special Functions
 *  Copyright (C) 1998 Ross Ihaka
 *  Copyright (C) 2000-2015  The R Core Team
 *  Copyright (C) 2004-2015  The R Foundation
 *
 *  This program is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 2 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program; if not, a copy is available at
 *  https://www.R-project.org/Licenses/
 *
 *  DESCRIPTION
 *
 *    The distribution function of the binomial distribution.
 */
import * as debug from 'debug';

import { pbeta } from '../beta/pbeta';
import {
  ML_ERR_return_NAN,
  R_DT_0,
  R_DT_1,
  R_nonint
} from '../common/_general';
import { map } from '../r-func';

const printer = debug('pbinom');
const { floor, round: R_forceint } = Math;
const { isNaN: ISNAN, isFinite: R_FINITE } = Number;

export function pbinom<T>(
  xx: T,
  n: number,
  p: number,
  lowerTail: boolean = true,
  logP: boolean = false
): T {
  return map(xx)(x => {
    if (ISNAN(x) || ISNAN(n) || ISNAN(p)) return NaN;
    if (!R_FINITE(n) || !R_FINITE(p)) {
      return ML_ERR_return_NAN(printer);
    }

    let lower_tail = lowerTail;
    let log_p = logP;

    if (R_nonint(n)) {
      printer('non-integer n = %d', n);
      return ML_ERR_return_NAN(printer);
    }
    n = R_forceint(n);
    /* 
     PR#8560: n=0 is a valid value 
  */
    if (n < 0 || p < 0 || p > 1) return ML_ERR_return_NAN(printer);

    if (x < 0) return R_DT_0(lower_tail, log_p);
    x = floor(x + 1e-7);
    if (n <= x) return R_DT_1(lower_tail, log_p);
    printer('calling pbeta:(q=%d,a=%d,b=%d, l.t=%s, log=%s', p, x + 1, n - x, !lower_tail, log_p);
    return pbeta(p, x + 1, n - x, !lower_tail, log_p);
  }) as any;
}
